var downloadUpload = function () {
    /**
     * Creates a new image element and appends it to a collection
     * @param {File} picFile - An image file
     * @param {*} src - An image src
     */
    function createImage(picFile, src) {
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

        /**
         * Uploads gif and seperates its frames
         */
        uploadGif: function () {
            var maxFrames = 20;
            var file = URL.createObjectURL(event.target.files[0]);

            // Only pics and files under 10mb (10.000.000 bytes)
            if (parseInt(file.size) > 10000000) {
                alert("File too big or not an image")
            } else {
                gifFrames({ url: file, frames: "all", outputType: 'canvas' })
                    .then(function (frameData) {
                        frameData.forEach(function (frame, i) {
                            if (i < maxFrames) {
                                state.gifFrames.appendChild(frameData[i].getImage());
                            }
                        })

                        for (frame of state.gifFrames.childNodes) {
                            createImage(null, frame.toDataURL())
                        }

                        state.gifFrames.innerHTML = "";

                    }).catch(console.error.bind(console));
            }
        },

        /**
         * Uploads image files
         */
        uploadFiles: function () {
            // Get files and output element
            var files = event.target.files;
            files = [...files].filter(s => s.type.includes("image"))

            // Go trough all files
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only pics and files under 10mb (10.000.000 bytes)
                if (!file.type.match('image') || parseInt(file.size) > 10000000) {
                    // To stop spaming
                    if (files.length <= 1) {
                        alert("File too big or not an image")
                    }
                    continue;
                }

                console.log(file)

                // Check if file has been loaded
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    createImage(event.target);
                    console.log(event.target)
                });

                //Read the image
                picReader.readAsDataURL(file);
            }
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
        importJson: function () {
            var file;

            // Create input
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = ".json";

            // Check for upload
            input.onchange = _ => {
                file = input.files[0];

                //Only json and files under 10mb (10.000.000 bytes)
                if (!file.type.match('.json') || parseInt(file.size) > 10000000) {
                    alert("File too big or not json");
                } else {
                    const reader = new FileReader();
                    reader.addEventListener('load', (event) => {
                        const json = atob(event.target.result.substring(29));
                        const result = JSON.parse(json);

                        state.xvalue.value = result.rows;
                        state.cell_width.value = result.width;
                        state.cell_height.value = result.height;

                        table.addTable();
                        imageInfo.setCellCollection(result.tableObject);

                        graphicHandler.redraw();
                    });
                    reader.readAsDataURL(file);
                }
            };

            // Click and remove
            input.click();
            input.remove()
        },

        pond: function () {
            var getDataUrl = function (file) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    createImage(null, reader.result);
                }
                reader.readAsDataURL(file);
            }

            FilePond.registerPlugin(FilePondPluginFileValidateSize);
            FilePond.registerPlugin(FilePondPluginFileValidateType);

            const inputElement = document.querySelector('#files');
            const uploadImage = FilePond.create(inputElement, {
                maxFileSize: "10mb",
                allowFileTypeValidation: true,
                acceptedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
                credits: false,
                onaddfile: (error) => {
                    if (error) {
                        return;
                    }

                    for (image of uploadImage.getFiles()) {
                        if (image.fileType == "image/gif") {
                            gifFrames({ url: file, frames: "all", outputType: 'canvas' })
                                .then(function (frameData) {
                                    frameData.forEach(function (frame, i) {
                                        if (i < maxFrames) {
                                            state.gifFrames.appendChild(frameData[i].getImage());
                                        }
                                    })

                                    for (frame of state.gifFrames.childNodes) {
                                        createImage(null, frame.toDataURL())
                                    }

                                    state.gifFrames.innerHTML = "";

                                }).catch(console.error.bind(console));
                        } else {
                            getDataUrl(image.file);
                        }
                        uploadImage.removeFile(files);
                    }
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
    * Checks if upload Json button has been clicked
    */
    state.uploadJson.addEventListener('click', function (e) {
        downloadUpload.importJson();
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
     * Uploads file(s)
     */
    window.onload = function () {
        //Check File API support
        if (window.File && window.FileList && window.FileReader) {
            // Checks when button is clicked and image file(s) have been submited
            state.files.addEventListener("change", function () {
                downloadUpload.uploadFiles();
            });

            // Checks when button is clicked and gif file have been submited
            state.gifFile.addEventListener("change", function () {
                downloadUpload.uploadGif();
            });


        } else {
            alert("Your browser does not support File API");
        }
    }

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