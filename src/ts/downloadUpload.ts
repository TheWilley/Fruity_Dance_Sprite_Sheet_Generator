import { Configuration } from './config'

class DownloadUpload {
    private config
    private state

    constructor() {
        const config = new Configuration()
        this.config = config.settings
        this.state = config.state
    }

    /**
     * Creates a new image element and appends it to a collection
     * @param {*} src - An image src
     */
    public async createImage(src: File) {
        return new Promise<void>((resolve) => {
            if (src) {
                var div = document.createElement("div");
                div.setAttribute("class", "result-container");
                this.compressImage(src, div).init();
                resolve();
            }
        })
    }

    /**
     * Checks if animations names are correct
     * @returns True | False
     */
    public checkAnimationNames() {
        var lines = this.state.textarea.value.split("\n");

        // Removes white lines
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == "") {
                lines.splice(i, i)
            }
        }

        // Get length of lines
        var linesLength = lines.length;

        // Check if valid
        if (linesLength > this.state.rows.value) {
            alert("There are more animation names than rows!")
            return false;
        } else if (lines[this.state.rows.value - 1] != "Held") {
            alert("Could not find animation name 'Held' at last line!")
            return false;
        } else {
            return true;
        }
    }

    /**
     * Inserts image to the sidebar
     * @param {string} image - An image object in base64
     * @param {Object} div - The div containg the image
     */
    public insertImage(image: string, div: HTMLDivElement) {
        // Insert the image
        div.innerHTML = `<img class='thumbnail draggable ${this.state.collection.value}' src='${image}' id='imagenumb${sessionStorage.imagenumb}' />`;

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
        this.state.result.insertBefore(div, null);

        animation.play();

        // Keep track of the number of files
        sessionStorage.imagenumb = Number(sessionStorage.imagenumb) + 1;

        // Add div to local storage
        localStorage.setItem("images", this.state.result.innerHTML);
        localStorage.setItem("imagenumb", sessionStorage.imagenumb)
    }


    /**
     * Compress sprite sheet along with a text file into a ZIP, then downloads it
     * @param {Object} canvas - The canvas element (sprite sheet)
     * @param {*} text - The animations names 
     * @param {*} filename - The filename of the exported ZIP
     */
    public downloadZIP(canvas: HTMLCanvasElement, text: string, filename: string) {
        var zip = new JSZip();
        var zipFilename = `${filename}.zip`;
        var output = new Image();
        output.src = canvas.toDataURL();

        if (this.checkAnimationNames()) {
            // Check for invalid characters in filename
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(filename) == true || filename == "") {
                alert("Illegal file name!")
            } else {
                // Zip image and text file
                zip.file(`${filename}.png`, output.src.substring(output.src.indexOf(',') + 1), { base64: true });
                zip.file(`${filename}.txt`, text)

                // Save file
                zip.generateAsync({ type: 'blob' }).then(function (content: any) {
                    saveAs(content, zipFilename);
                });
            }
        }
    },

    /**
     * Removes all stored image elements
     */
    public clearData() {
        if (!confirm('This action will remove ALL UPLOADED IMAGES. Continue?')) {
            return;
        }

        // Reset local storage
        localStorage.setItem("images", "")
        localStorage.setItem("imagenumb", "")

        location.reload();
    },

    /**
     * Saves a json file containing data about sprite sheet
     */
    public saveJson() {
        var object = {
            spriteSheetId: "cWqgPFdGN5", // Identifies the json as a sprite sheet
            rows: this.state.rows.value,
            rowNames: this.state.textarea.value,
            width: this.state.cell_width.value,
            height: this.state.cell_height.value,
            tableObject: imageInfo.getCellCollection()
        }

        // Create a blob of the data
        var fileToSave = new Blob([JSON.stringify(object, undefined, 2)], {
            type: 'application/json'
        });

        // Save the file
        saveAs(fileToSave, "savedSpritSheet.json");
    }

    /**
     * Creates drag and drop functionality
     */
    public pond() {
        FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

        /**
         * Extracts all frames from a gif file
         * @param {Object} file - A gif file
         * @returns 
         */
        var extractFrames = async function (file: File) {
            return new Promise<void>((resolve) => {
                var maxFrames = this.config.settings.maxAllowedGifFrames;

                // Export frames depending on transparency
                gifFrames({ url: file, frames: "all", outputType: 'canvas', cumulative: this.state.cumulative.value == "cumulative" ? false : true })
                    .then(function (frameData: any) {
                        frameData.forEach(function (frame, i) {
                            if (i < maxFrames) {
                                this.state.gifFrames.appendChild(frameData[i].getImage());
                            }
                        })

                        for (const frame of this.state.gifFrames.childNodes) {
                            // https://stackoverflow.com/a/60005078
                            fetch(frame.toDataURL()).then(res => { return res.blob() }).then(async function (blob) { await this.createImage(blob) });
                        }

                        this.state.gifFrames.innerHTML = "";
                    }).catch(console.error.bind(console));
                resolve();
            })
        }

        /**
         * FilePond instance for images / gifs
         */
        const uploadImage = FilePond.create(document.querySelector('#files'), {
            // Settings
            labelIdle: 'Drag & Drop your <b>Image(s) / Gif</b> file or <span class="filepond--label-action"> Browse </span>',
            maxFileSize: this.config.maxUploadSize ? this.config.maxUploadSize : "2mb",
            allowMultiple: true,
            maxFiles: 20,
            allowFileTypeValidation: true,
            acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
            credits: false,

            onaddfile: async (error, image) => {
                if (error) {
                    return
                }

                // For every image
                try {
                    if (image.fileType == "image/gif") {
                        await extractFrames(image.getFileEncodeDataURL())
                        uploadImage.removeFile(image);
                    } else {
                        await this.createImage(image.file);
                        uploadImage.removeFile(image);
                    }
                } catch (err) {
                    if (err instanceof TypeError) {
                        console.log("Invalid File")
                    }
                }

            }
        });

        /**
         * Handles and manages uploaded json data
         * @param {string} json - The json containing sprite sheet data
         */
        var handleJson = function (json: any) {
            this.state.rows.value = json.rows;
            this.state.cell_width.value = json.width;
            this.state.cell_height.value = json.height;

            table.addTable();
            this.state.textarea.value = json.rowNames;
            imageInfo.setCellCollection(json.tableObject);
            table.iterateTable();
            graphicHandler.redraw();
        }

        /**
         * Filepond instance for json files
         */
        const uploadJson = FilePond.create(document.querySelector('#uploadJson'), {
            // Settings
            labelIdle: 'Drag & Drop your <b> JSON </b> file or <span class="filepond--label-action"> Browse </span>',
            maxFileSize: "10mb",
            allowFileTypeValidation: true,
            acceptedFileTypes: ['application/json'],
            credits: false,
            labelFileProcessingError: (error: any) => {
                return error.body;
            },

            server: {
                process: (fieldName: string, file: File, metadata: any, load: any, error: any, progress: any, abort: any) => {
                    if (JSON.parse(atob(uploadJson.getFile().getFileEncodeDataURL().substring(29))).spriteSheetId == "cWqgPFdGN5") {
                        handleJson(JSON.parse(atob(uploadJson.getFile().getFileEncodeDataURL().substring(29))));
                        setTimeout(() => {
                            uploadJson.removeFile();
                        }, 500)
                    } else {
                        error(`File is not a sprite sheet!`)
                    }
                }
            },
        });
    }
}

/**
 * Compresses image when uploading.
 * 
 * Made by {@link https://labs.madisoft.it/javascript-image-compression-and-resizing/ MIRCO BELLAGAMBA} 
 * @param {Object} file - The image file
 * 
 */
class CompressImages {
    public file: File
    public div: HTMLDivElement

    constructor(file: File, div: HTMLDivElement) {
        this.file = file
        this.div = div
    }

    /**
     * Converts a blob to base64
     * @param {Object} blob - A blob object in the dataURL format
     * @returns 
     */
    private convertToBase64(blob: Blob) {
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
    private calculateSize(img: HTMLImageElement, maxWidth: number, maxHeight: nummber) {
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
        const MAX_WIDTH = this.config.settings.maxWidth * this.config.settings.imageSizeMultiplier;
        const MAX_HEIGHT = this.config.settings.maxHeight * this.config.settings.imageSizeMultiplier;
        const MIME_TYPE = "image/png";
        const QUALITY = this.config.settings.imageQuality

        // Convert file to blobURL
        const blobURL = URL.createObjectURL(file)

        // Create new image and assign the blob to it
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
            URL.revokeObjectURL(this.src);
            // Handle the failure properly
            console.log("Cannot load image");
        };

        // When image loads, compress it 
        img.onload = function () {
            URL.revokeObjectURL(this.src);

            // Assign width and height
            const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Get image and draw it
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.toBlob(
                async (blob) => {
                    var base64 = await convertToBase64(blob);
                    self.insertImage(base64, div);
                },
                MIME_TYPE,
                QUALITY
            );
        };
    }
}

class EventListeners {
    private config
    private downloadUpload
    private state

    constructor() {
        const config = new Configuration()
        this.downloadUpload = new DownloadUpload()
        this.config = config.settings
        this.state = config.state
    }

    run() {
        const self = this
        /**
         * Keyboard shortcut
         * https://stackoverflow.com/a/14180949
         */
        $(window).bind('keydown', function (event: KeyboardEvent) {
            if (event.ctrlKey || event.metaKey) {
                switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's': // Save
                        event.preventDefault();
                        this.state.downloadJson.click();
                        break;
                    case 'e': // Export
                        event.preventDefault();
                        this.state.filename.value = "savedSpriteSheet";
                        this.state.downloadSpriteSheet.click();
                        this.state.filename.value = "";
                        break;
                    case 'u': // Clear uploaded images
                        event.preventDefault();
                        this.state.clear.click();
                        break;
                }
            }
        });

        /**
         * Checks if download sprite sheet button has been clicked
         */
        this.state.downloadSpriteSheet.addEventListener('click', function (e) {
            self.downloadUpload.downloadZIP(canvas, self.state.textarea.value, self.state.filename.value);
        });

        /**
         * Checks if download Json button has been clicked sdfsd
         */
        this.state.downloadJson.addEventListener('click', function (e) {
            self.downloadUpload.saveJson();
        });

        /**
         * Creates table when website has loaded
         */
        document.onreadythis.statechange = () => {
            if (document.readythis.state === 'complete') {
                table.addTable();
                graphicHandler.ctx()
            }
        };

        /**
         * Checks scroll position
         */
        window.addEventListener("scroll", (event) => {
            if (this.scrollY >= 45) {
                this.state.sidebar.classList.add("fixedSidebar")
                this.state.sidebarContainer.classList.add("fixedContainer")
            } else {
                this.state.sidebar.classList.remove("fixedSidebar")
                this.state.sidebarContainer.classList.remove("fixedContainer")
            }
        });

        /**
         * Runs Before leaving page
         */
        $(window).bind('beforeunload', function () {
            if (config.settings.warnBeforeLeavingPage) return 'Your changes might not be saved';
        })

        /**
         * Checks if element values are too high or low
         */
        $([this.state.rows, this.state.cell_width, this.state.cell_height]).change(function (event) {
            EventListeners.checkMinMax(event);
            if (table.checkEmptyCells()) table.addTable();
        });

        /**
         * Checks if the current value is under its minimum / over its maximum
         * @param {object} event 
         */
        checkMinMax: function (event) {
            if (parseInt(event.target.value) > parseInt(event.target.getAttribute("max"))) event.target.value = parseInt(event.target.getAttribute("max"));
            if (parseInt(event.target.value) < parseInt(event.target.getAttribute("min"))) event.target.value = parseInt(event.target.getAttribute("min"));
        }
    }
}