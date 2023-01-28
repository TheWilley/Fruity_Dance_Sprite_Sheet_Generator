import { config } from "../../../app"

/**
 * Compresses image when uploading.
 * 
 * Made by {@link https://labs.madisoft.it/javascript-image-compression-and-resizing/ MIRCO BELLAGAMBA} 
 * @param {Object} file - The image file
 * 
 */
class CompressImages {
    private _settings = config.settings
    private _state = config.state
    private _file
    private _div

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
     * Inserts image to the sidebar
     * @param {string} image - An image object in base64
     * @param {Object} div - The div containg the image
     */
    public insertImage(image: string, div: HTMLDivElement) {
        // Insert the image
        div.innerHTML = `<img class='thumbnail draggable ${this._state.collection.value}' src='${image}' id='imagenumb${sessionStorage.imagenumb}' />`;

        // Create animation
        const animation = div.animate(
            [
                { transform: 'translateX(-100%)', opacity: '0%' },
                { transform: 'translateX(0)', opacity: '100%' }
            ], {
            easing: 'ease',
            duration: 500
        });

        // Insert the combined div and image
        this._state.result.insertBefore(div, null);

        animation.play();

        // Keep track of the number of files
        sessionStorage.imagenumb = Number(sessionStorage.imagenumb) + 1;

        // Add div to local storage
        localStorage.setItem("images", this._state.result.innerHTML);
        localStorage.setItem("imagenumb", sessionStorage.imagenumb)
    }

    /**
     * Initiates the compression
     */
    public init() {
        // Settings
        const MAX_WIDTH = this._settings.maxWidth * this._settings.imageSizeMultiplier;
        const MAX_HEIGHT = this._settings.maxHeight * this._settings.imageSizeMultiplier;
        const MIME_TYPE = "image/png";
        const QUALITY = this._settings.imageQuality
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
                    self.insertImage(base64, self._div);
                },
                MIME_TYPE,
                QUALITY
            );
        };
    }
}

export default CompressImages