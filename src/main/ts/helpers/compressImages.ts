import { config, downloadUpload } from "../globals"

/**
 * Compresses image when uploading.
 * 
 * Made by {@link https://labs.madisoft.it/javascript-image-compression-and-resizing/ MIRCO BELLAGAMBA} 
 * @param {Object} file - The image file
 * 
 */
class CompressImages {
    public _downloadUpload = downloadUpload
    public _config = config.settings
    public _file
    public _div

    constructor(file: File, div: HTMLDivElement) {
        this._file = file
        this._div = div
    }

    /**
     * Converts a blob to base64
     * @param {Object} blob - A blob object in the dataURL format
     * @returns 
     */
    convertToBase64(blob: Blob) {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                resolve(reader.result);
            }
        })
    }

    /**
     * Calculates size of canvas
     * @param {object} img 
     * @param {number} maxWidth 
     * @param {number} maxHeight 
     * @returns array
     */
    private calculateSize(img: HTMLImageElement, maxWidth: number, maxHeight: number) {
        let width = img.width;
        let height = img.height;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
        }
        return [width, height];
    }

    /**
     * Initiates the compression
     */
    public init() {
        // Settings
        const MAX_WIDTH = this._config.maxWidth * this._config.imageSizeMultiplier;
        const MAX_HEIGHT = this._config.maxHeight * this._config.imageSizeMultiplier;
        const MIME_TYPE = "image/png";
        const QUALITY = this._config.imageQuality
        const self = this

        // Convert file to blobURL
        const blobURL = URL.createObjectURL(this._file)

        // Create new image and assign the blob to it
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
            URL.revokeObjectURL(img.src);
            // Handle the failure properly
            console.log("Cannot load image");
        };

        // When image loads, compress it 
        img.onload = function () {
            URL.revokeObjectURL(img.src);

            // Assign width and height
            const [newWidth, newHeight] = self.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Get image and draw it
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.toBlob(
                async (blob) => {
                    var base64 = await self.convertToBase64(blob) as string;
                    self._downloadUpload.insertImage(base64, self._div);
                },
                MIME_TYPE,
                QUALITY
            );
        };
    }
}

export default CompressImages