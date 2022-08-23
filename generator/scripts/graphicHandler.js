var graphicHandler = function () {
    var selectedItem;
    var previewObjects = [];
    sessionStorage.imagenumb = 0;

    return {
        /**
         * Inserts an image to the canvas
         * @param {string} image - The image src 
         * @param {number} rownumb - The row number (Y)
         * @param {number} cellnumb - The cell number (X)
         * @param {number} Xoffset - The image offset in the X axis
         * @param {number} Yoffset - The image offset in the Y axis
         * @param {('wholeCanvas'|'partOfCanvas')} clear - How much of the canvas to be cleared
         */
        generateCanvas: function (image, rownumb, cellnumb, Xoffset = 0, Yoffset = 0, clear) {
            // This is where we create the canvas and insert images
            let GeneratedCanvas = new Image();
            GeneratedCanvas.src = image;

            if (state.canvas.getContext) {
                ctx = state.canvas.getContext('2d');

                // Get width and height
                let cell_width = parseInt(state.cell_width.value);
                let cell_height = parseInt(state.cell_height.value);

                // Check if whole canvas is being cleared or only part of it
                switch(clear) {case "wholeCanvas": ctx.clearRect(0, 0, state.canvas.width, state.canvas.height); case "partOfCanvas": ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height) }

                // Drawing of image
                GeneratedCanvas.onload = function () {
                    ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
                };
            }
        },

        /**
         * Redraws canvas
         */
        redraw: function () {
            imageInfo.getCellCollection().forEach(row => {
                row.forEach(cell => {
                    if (cell.imageSrc != undefined) {
                        this.generateCanvas(cell.imageSrc, cell.x, cell.y, cell.xOffset, cell.yOffset, "wholeCanvas")
                    }
                });
            })
        },

        /**
         * Removes an image from the table
         */
        remove: function () {
            currentObject = selectedItem;
            // Get row / cell number
            var rownumb = currentObject.parentNode.dataset.x;
            var cellnumb = currentObject.parentNode.dataset.y;

            // Step 1, remove from canvas
            this.generateCanvas(null, rownumb, cellnumb, imageInfo.getCellCollection()[rownumb][cellnumb].xOffset, imageInfo.getCellCollection()[rownumb][cellnumb].yOffset, "partOfCanvas");

            // Step 2, remove from array
            imageInfo.getCellCollection()[rownumb][cellnumb] = new ImageObject(rownumb, cellnumb);
            imageInfo.getCellCollection()[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
            imageInfo.getCellCollection()[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset

            // Step 3, remove regenerate and remove from grid
            currentObject.parentNode.appendChild(table.generateImage());
            currentObject.remove();

            // Step 4, redraw
            this.redraw()

            // Step 5, disable controls
            imageOffset.disableControls(true)
        },

        /**
         * Restarts or stops the preview
         * @param {boolean} restart - True: Restart preview; False: Stop preview;
         */
        configPreview: function (restart) {
            if (restart == true) {
                previewObjects.forEach(obj => {
                    if (obj.getPauseState == true) {
                        obj.restart()
                    }
                })
            } else {
                previewObjects.forEach(obj => {
                    obj.stop()
                })
            }
        },

        /**
         * Start or stop the preview of an image when draging an image
         * @param {*} preview - True: Start preview; False: Stop preview;
         */
        previewImage: function (preview) {
            if (preview) {
                popup.style.transform = "translate(-50%, 290px)";
                state.mouseCircle.style.opacity = "100%";
                state.delete.style.border = "3px dashed red"
            } else {
                state.popup.style.transform = "translate(-50%, 150px)";
                state.mouseCircle.style.opacity = "0%"
                state.delete.style.border = "none"
            };
        },

        /**
         * Only show elements based on which collection user wants to see 
         */
        filterClass: function() {
            for (e of document.querySelectorAll(".thumbnail")) {
                if (!e.classList.contains(state.collection.value)) {
                    e.style.display = "none"
                } else {
                    e.style.display = "block"
                }
            }
            localStorage.setItem("images", state.result.innerHTML);
        },

        /**
         * Context menu creation 
         */
        ctx: function () {
            const contextMenu = CtxMenu(".thumbnail");

            /**
             * Generates an array for the options in the context menu
             * @returns {Array} - An array with <option/> elements
             */
            const classNames = function () {
                var temp = []
                for (let i = 0; i < 10; i++) {
                    temp.push("col" + i)

                    contextMenu.addItem(`Collection ${i}`, function () {
                        changeClass(contextMenu._elementClicked, "col" + i)
                    });

                    var option = document.createElement("option");
                    option.value = "col" + i;
                    option.innerHTML = `Collection ${i}`;
                    state.collection.appendChild(option)

                    graphicHandler.filterClass()
                }
                return temp;
            }()

            /**
             * Changes the class name of an element and removed old ones based on `classNames`
             * @param {Object} element - The element to change class of
             * @param {string} className - The new class name
             */
            const changeClass = function (element, className) {
                for (n of classNames) {
                    if (n != className) {
                        element.classList.remove(n)
                    } else {
                        element.classList.add(className)
                    }
                }
                graphicHandler.filterClass()
            }
        },

        /*/ Getters /*/
        getSelectedItem: function () {
            return selectedItem;
        },

        getPreviewObjects: function () {
            return previewObjects;
        },

        /*/ Setters /*/
        setSelectedItem: function (e) {
            selectedItem = e;
        },
    }
}()