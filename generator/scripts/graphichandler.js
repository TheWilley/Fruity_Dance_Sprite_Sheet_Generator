var graphicHandler = function () {
    var selectedItem;
    var previewObjects = [];
    var clear = false;
    sessionStorage.imagenumb = 0;

    return {
        preview_image: function (image, rownumb, cellnumb) {
            // This is where we create the canvas and insert images
            let GeneratedCanvas = new Image();
            GeneratedCanvas.src = image;

            let ctx = state.canvas;
            if (ctx.getContext) {
                ctx = ctx.getContext('2d');
                // Drawing of image
                GeneratedCanvas.onload = function () {
                    let cell_width = parseInt(state.cell_width.value);
                    let cell_height = parseInt(state.cell_height.value);

                    ctx.drawImage(GeneratedCanvas, cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
                };
            }
        },

        preview_image_edit: function (image, rownumb, cellnumb, Xoffset, Yoffset) {
            // This is where we create the canvas and insert images
            let GeneratedCanvas = new Image();
            GeneratedCanvas.src = image;

            if (state.canvas.getContext) {
                ctx = state.canvas.getContext('2d');

                // Get width and height
                let cell_width = parseInt(state.cell_width.value);
                let cell_height = parseInt(state.cell_height.value);

                // Check if the whole canvas is being cleared
                if (clear) { ctx.clearRect(0, 0, state.canvas.width, state.canvas.height) };

                // Check if a part of the canvas is being cleared
                if (image == "") { ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height) }

                // Bool restore
                clear = false;

                // Drawing of image
                GeneratedCanvas.onload = function () {
                    // Create clipping path
                    ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
                };
            }
        },

        redraw: function () {
            cellCollection.forEach(row => {
                row.forEach(cell => {
                    if (cell.imageSrc != undefined) {
                        this.preview_image_edit(cell.imageSrc, cell.x, cell.y, cell.xOffset, cell.yOffset)
                    }
                });
            })
        },

        remove: function () {
            currentObject = selectedItem;
            // Get row / cell number
            var rownumb = currentObject.parentNode.dataset.x;
            var cellnumb = currentObject.parentNode.dataset.y;

            // Step 1, remove from canvas
            this.preview_image_edit("", rownumb, cellnumb, cellCollection[rownumb][cellnumb].xOffset, cellCollection[rownumb][cellnumb].yOffset);

            // Step 2, remove from array
            cellCollection[rownumb][cellnumb] = new ImageObject(rownumb, cellnumb);
            cellCollection[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
            cellCollection[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset

            // Step 3, remove regenerate and remove from grid
            currentObject.parentNode.appendChild(table.generateImage());
            currentObject.remove();

            // Step 4, redraw
            this.redraw()

            // Step 5, disable controls
            imageOffset.disableControls(true)
        },

        configPreview: function (e) {
            if (e == true) {
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

        previewImage: function (e) {
            if (e) {
                popup.style.transform = "translate(-50%, 300px)";
                state.mouseCircle.style.opacity = "100%";
                state.delete.style.border = "3px dashed red"
            } else {
                state.popup.style.transform = "translate(-50%, 150px)";
                state.mouseCircle.style.opacity = "0%"
                state.delete.style.border = "none"

            };
        },

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

        ctx: function () {
            const contextMenu = CtxMenu(".thumbnail");

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

        // Getters
        getSelectedItem: function () {
            return selectedItem;
        },

        getPreviewObjects: function () {
            return previewObjects;
        },

        getClear: function () {
            return clear;
        },

        // Setters
        setSelectedItem: function (e) {
            selectedItem = e;
        },

        setClear: function (e) {
            clear = e;
        }
    }
}()