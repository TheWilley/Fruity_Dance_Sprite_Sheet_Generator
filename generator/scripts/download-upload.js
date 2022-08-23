var downloadUpload = function () {

    /**
     * Compresses image when uploading.
     * 
     * Made by {@link https://labs.madisoft.it/javascript-image-compression-and-resizing/ MIRCO BELLAGAMBA} 
     * @param {Object} file - The image file
     * 
     */
    async function compressImage(file, div) {
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

        // Settings
        const MAX_WIDTH = config.settings.maxWidth;
        const MAX_HEIGHT = config.settings.maxHeight;
        const MIME_TYPE = "image/jpeg";
        const QUALITY = config.settings.compressionRate

        /*/ Begin processing /*/
        var blobURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
            URL.revokeObjectURL(this.src);
            // Handle the failure properly
            console.log("Cannot load image");
        };
        img.onload = function () {
            URL.revokeObjectURL(this.src);
            const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.toBlob(
                (blob) => {
                    insertImage(blob, div);
                },
                MIME_TYPE,
                QUALITY
            );
        };
    }

    /**
     * Creates a new image element and appends it to a collection
     * @param {*} src - An image src
     */
    async function createImage(src) {
        var div = document.createElement("div");
        div.setAttribute("class", "result-container");
        await compressImage(src, div);
    }

    function insertImage(blob, div) {
        // Insert the image
        div.innerHTML = "<img class='thumbnail draggable " + state.collection.value + "' src='" + URL.createObjectURL(blob) + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";

        // Insert the combined div and image
        state.result.insertBefore(div, null);

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
        saveJson: function () {
            var object = {
                spriteSheetId: "cWqgPFdGN5", // Identifies the json as a sprite sheet
                rows: state.rows.value,
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

        pond: function () {
            FilePond.registerPlugin(FilePondPluginFileEncode, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);
            var extractFrames = function (file) {
                maxFrames = 20;

                gifFrames({ url: file, frames: "all", outputType: 'canvas' })
                    .then(function (frameData) {
                        frameData.forEach(function (frame, i) {
                            if (i < maxFrames) {
                                state.gifFrames.appendChild(frameData[i].getImage());
                            }
                        })

                        for (frame of state.gifFrames.childNodes) {
                            createImage(frame.toBlob())
                        }

                        state.gifFrames.innerHTML = "";

                    }).catch(console.error.bind(console));
            }

            const uploadImage = FilePond.create(document.querySelector('#files'), {
                // Settings
                labelIdle: 'Drag & Drop your <b>Image(s) / Gif</b> file or <span class="filepond--label-action"> Browse </span>',
                maxFileSize: config.settings.maxUploadSize ? config.settings.maxUploadSize : "2mb",
                allowMultiple: true,
                maxFiles: 20,
                allowFileTypeValidation: true,
                acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
                credits: false,

                onaddfile: (error, file) => {
                    if (error) {
                        return
                    }

                    // For every image
                    for (i = 0; i < uploadImage.getFiles().length; i++) {
                        image = uploadImage.getFile(i);
                        try {
                            if (image.fileType == "image/gif") {
                                extractFrames(image.getFileEncodeDataURL())
                                uploadImage.removeFile(image);
                            } else {
                                createImage(image.file);
                                uploadImage.removeFile(image);
                            }
                        } catch (err) {
                            if (err instanceof TypeError) {
                                console.log("Invalid File", err)
                            }
                        }
                    }
                }
            });

            var handleJson = function (json) {
                state.rows.value = json.rows;
                state.cell_width.value = json.width;
                state.cell_height.value = json.height;

                table.addTable();
                imageInfo.setCellCollection(json.tableObject);
                table.iterateTable();
                graphicHandler.redraw();
            }

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