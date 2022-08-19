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
            div.innerHTML = "<img class='thumbnail draggable " + state.collection.value+ "' src='" + src + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";
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

            //Only pics and files under 10mb (10.000.000 bytes)
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

                // Check if file has been loaded
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    createImage(event.target);
                });

                //Read the image
                picReader.readAsDataURL(file);
            }
        }
    }
}()

var eventListeners = function () {

    /**
     * Checks if download button has been clicked
     */
    state.download.addEventListener('click', function (e) {
        downloadUpload.downloadZIP(canvas, state.textarea.value, state.filename.value);
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
            state.files.addEventListener("change", function (event) {
                downloadUpload.uploadFiles();
            });

            // Checks when button is clicked and gif file have been submited
            state.gifFile.addEventListener("change", function (event) {
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