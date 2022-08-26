var downloadUpload = function () {
    /**
     * Compresses image when uploading.
     * 
     * Made by {@link https://labs.madisoft.it/javascript-image-compression-and-resizing/ MIRCO BELLAGAMBA} 
     * @param {Object} file - The image file
     * 
     */
    function compressImage(file, div) {
        /**
         * Converts a blob to base64
         * @param {Object} blob - A blob object in the dataURL format
         * @returns 
         */
        function convertToBase64(blob) {
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
        function calculateSize(img, maxWidth, maxHeight) {
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

        return {
            /**
             * Initiates the compression
             */
            init: function () {
                // Settings
                const MAX_WIDTH = config.settings.maxWidth;
                const MAX_HEIGHT = config.settings.maxHeight;
                const MIME_TYPE = "image/png";
                const QUALITY = config.settings.compressionRate

                // Convert file to blobURL
                blobURL = URL.createObjectURL(file)

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
                            insertImage(base64, div);
                        },
                        MIME_TYPE,
                        QUALITY
                    );
                };
            }
        }
    }

    /**
     * Creates a new image element and appends it to a collection
     * @param {*} src - An image src
     */
    async function createImage(src) {
        return new Promise((resolve) => {
            if (src) {
                var span = document.createElement("span");
                span.setAttribute("class", "result-container");
                compressImage(src, span).init();
                resolve();
            }
        })
    }

    /**
     * Checks if animations names are correct
     * @returns True | False
     */
    function checkAnimationNames() {
        var lines = state.textarea.value.split("\n");

        // Removes white lines
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == "") {
                lines.splice(i, i)
            }
        }

        // Get length of lines
        var linesLength = lines.length;

        // Check if valid
        if (linesLength > parseInt(state.rows.value)) {
            alert("There are more animation names than rows!")
            return false;
        } else if (lines[parseInt(state.rows.value - 1)] != "Held") {
            alert("Could not find 'Held' at last line!")
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
    function insertImage(image, div) {
        // Insert the image
        div.innerHTML = "<img class='thumbnail draggable " + state.collection.value + "' src='" + image + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";

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
        state.result.insertBefore(div, null);

        animation.play();

        // Keep track of the number of files
        sessionStorage.imagenumb = Number(sessionStorage.imagenumb) + 1;

        // Add div to local storage
        localStorage.setItem("images", state.result.innerHTML);
        localStorage.setItem("imagenumb", sessionStorage.imagenumb)
    }

    return {
        /**
         * Compress sprite sheet along with a text file into a ZIP, then downloads it
         * @param {Object} canvas - The canvas element (sprite sheet)
         * @param {*} text - The animations names 
         * @param {*} filename - The filename of the exported ZIP
         */
        downloadZIP: function (canvas, text, filename) {
            var zip = new JSZip();
            var zipFilename = `${filename}.zip`;
            var output = new Image();
            output.src = canvas.toDataURL();

            if (checkAnimationNames()) {
                // Check for invalid characters in filename
                if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(filename) == true || filename == "") {
                    alert("Illegal file name!")
                } else {
                    // Zip image and text file
                    zip.file(`${filename}.png`, output.src.substring(output.src.indexOf(',') + 1), { base64: true });
                    zip.file(`${filename}.txt`, text)

                    // Save file
                    zip.generateAsync({ type: 'blob' }).then(function (content) {
                        saveAs(content, zipFilename);
                    });
                }
            }
        },

        /**
         * Removes all stored image elements
         */
        clearData: function () {
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
        saveJson: function () {
            var object = {
                spriteSheetId: "cWqgPFdGN5", // Identifies the json as a sprite sheet
                rows: state.rows.value,
                rowNames: state.textarea.value,
                width: state.cell_width.value,
                height: state.cell_height.value,
                tableObject: imageInfo.getCellCollection()
            }

            // Create a blob of the data
            var fileToSave = new Blob([JSON.stringify(object, undefined, 2)], {
                type: 'application/json'
            });

            // Save the file
            saveAs(fileToSave, "savedSpritSheet.json");
        },

        /**
         * Creates drag and drop functionality
         */
        pond: function () {
            FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

            /**
             * Extracts all frames from a gif file
             * @param {Object} file - A gif file
             * @returns 
             */
            var extractFrames = async function (file) {
                return new Promise((resolve) => {
                    var maxFrames = config.settings.maxAllowedGifFrames;

                    // Export frames depending on transparency
                    gifFrames({ url: file, frames: "all", outputType: 'canvas', cumulative: state.cumulative.value == "cumulative" ? false : true })
                        .then(function (frameData) {
                            frameData.forEach(function (frame, i) {
                                if (i < maxFrames) {
                                    state.gifFrames.appendChild(frameData[i].getImage());
                                }
                            })

                            for (frame of state.gifFrames.childNodes) {
                                // https://stackoverflow.com/a/60005078
                                fetch(frame.toDataURL()).then(res => { return res.blob() }).then(async function (blob) { await createImage(blob) });
                            }

                            state.gifFrames.innerHTML = "";
                            resolve();
                        }).catch(console.error.bind(console));
                })
            }

            /**
             * FilePond instance for images / gifs
             */
            const uploadImage = FilePond.create(document.querySelector('#files'), {
                // Settings
                labelIdle: 'Drag & Drop your <b>Image(s) / Gif</b> file or <span class="filepond--label-action"> Browse </span>',
                maxFileSize: config.settings.maxUploadSize ? config.settings.maxUploadSize : "2mb",
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
                            await createImage(image.file);
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
            var handleJson = function (json) {
                state.rows.value = json.rows;
                state.cell_width.value = json.width;
                state.cell_height.value = json.height;

                table.addTable();
                state.textarea.value = json.rowNames;
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
                labelFileProcessingError: (error) => {
                    return error.body;
                },

                server: {
                    process: (fieldName, file, metadata, load, error, progress, abort) => {
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
        }()
    }
}()

var eventListeners = function () {
    /**
     * Keyboard shortcut
     * https://stackoverflow.com/a/14180949
     */
    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's': // Save
                    event.preventDefault();
                    state.downloadJson.click()
                    break;
                case 'e': // Export
                    event.preventDefault();
                    state.downloadSpriteSheet.click()
                    break;
                case 'u': // Clear uploaded images
                    event.preventDefault();
                    state.clear.click()
                    break;
            }
        }
    });

    /**
     * Checks if download sprite sheet button has been clicked
     */
    state.downloadSpriteSheet.addEventListener('click', function (e) {
        downloadUpload.downloadZIP(canvas, state.textarea.value, state.filename.value);
    });

    /**
     * Checks if download Json button has been clicked sdfsd
     */
    state.downloadJson.addEventListener('click', function (e) {
        downloadUpload.saveJson();
    });

    /**
     * Creates table when website has loaded
     */
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            table.addTable();
            graphicHandler.ctx()
        }
    };

    /**
     * Checks scroll position
     */
    window.addEventListener("scroll", (event) => {
        if (this.scrollY >= 45) {
            state.sidebar.classList.add("fixedSidebar")
            state.sidebarContainer.classList.add("fixedContainer")
        } else {
            state.sidebar.classList.remove("fixedSidebar")
            state.sidebarContainer.classList.remove("fixedContainer")
        }
    });

    /**
     * Runs Before leaving page
     */
    $(window).bind('beforeunload', function () {
        //return 'Your changes might not be saved';
    })

    /**
     * Checks if element values are too high or low
     */
    $([state.rows, state.cell_width, state.cell_height]).change(function (event) {
        eventListeners.checkMinMax(event);
        if (table.checkEmptyCells()) table.addTable();
    });

    return {
        /**
         * Checks if the current value is under its minimum / over its maximum
         * @param {object} event 
         */
        checkMinMax: function (event) {
            if (parseInt(event.target.value) > parseInt(event.target.getAttribute("max"))) event.target.value = parseInt(event.target.getAttribute("max"));
            if (parseInt(event.target.value) < parseInt(event.target.getAttribute("min"))) event.target.value = parseInt(event.target.getAttribute("min"));
        }
    }
}()