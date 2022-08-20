var downloadUpload = function () {
    /**
     * Creates a new image element and appends it to a collection
     * @param {*} src - An image src
     */
    function createImage(src) {
        // Create div for image
        var div = document.createElement("div");
        div.setAttribute("class", "result-container");

        if (src == null) {
            // Insert the image
            div.innerHTML = "<img class='thumbnail draggable" + state.collection.value + "' src='" + picFile.result + "'" +
                "title='" + picFile.name + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";
        } else {
            // Insert the image
            div.innerHTML = "<img class='thumbnail draggable " + state.collection.value + "' src='" + src + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";
        }

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
                rows: state.xvalue.value,
                width: state.cell_width.value,
                height: state.cell_height.value,
                tableObject: imageInfo.getCellCollection(),
            }

            // Create a blob of the data
            var fileToSave = new Blob([JSON.stringify(object, undefined, 2)], {
                type: 'application/json'
            });

            // Save the file
            saveAs(fileToSave, "savedSpritSheet.json");
        },

        pond: function () {
            FilePond.registerPlugin(FilePondPluginFileEncode);
            FilePond.registerPlugin(FilePondPluginFileValidateSize);
            FilePond.registerPlugin(FilePondPluginFileValidateType);

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
                            createImage(frame.toDataURL())
                        }

                        state.gifFrames.innerHTML = "";

                    }).catch(console.error.bind(console));
            }

            const uploadImage = FilePond.create(document.querySelector('#files'), {
                // Settings
                maxFileSize: "10mb",
                allowFileTypeValidation: true,
                acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
                credits: false,

                // When a file has been added
                onaddfile: (error) => {
                    if (error) {
                        return;
                    }

                    // For every image
                    for (image of uploadImage.getFiles()) {
                        if (image.fileType == "image/gif") {
                            extractFrames(image.getFileEncodeDataURL())
                        } else {
                            createImage(image.getFileEncodeDataURL());
                        }
                        // Remove files after they have been uploaded
                        uploadImage.removeFile(files);
                    }
                }
            });

            var handleJson = function (json) {
                state.xvalue.value = json.rows;
                state.cell_width.value = json.width;
                state.cell_height.value = json.height;

                table.addTable();
                imageInfo.setCellCollection(json.tableObject);

                graphicHandler.redraw();
            }

            const uploadJson = FilePond.create(document.querySelector('#uploadJson'), {
                // Settings
                maxFileSize: "10mb",
                allowFileTypeValidation: true,
                acceptedFileTypes: ['application/json'],
                credits: false,

                // When a file has been added
                onaddfile: (error) => {
                    if (error) {
                        return;
                    }

                    handleJson(JSON.parse(atob(uploadJson.getFile().getFileEncodeDataURL().substring(29))));
                }
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
}()