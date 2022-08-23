var table = function () {
    return {
        iterateTable: function () {
            for (var i = 1, row; row = state.dyntable.rows[i]; i++) {
                for (var j = 0, col; col = row.cells[j]; j++) {
                    col.childNode.src = imageInfo.getCellCollection()[col.getAttribute("data-x")][col.getAttribute("data-y")].imageSrc
                }
            }
        },

        checkEmptyCells: function () {
            // Check if there is any image added and warn user
            var allCellsEmpty = true;

            imageInfo.getCellCollection().forEach(e1 => {
                e1.forEach(e2 => {
                    if (!e2.imageSrc == "") {
                        allCellsEmpty = false;
                    }
                })
            })

            if (!allCellsEmpty) {
                console.log(state.rows.value)
                if (!confirm('This action will clear the canvas! Continue?')) {
                    return false;
                }
            }

            return true
        },

        /**
         * Generates an image element
         * @returns {object} - The image element
         */
        generateImage: function () {
            // Generate image cells
            let image = document.createElement('IMG');

            // Set all image_cell attributes
            image.setAttribute("class", "immg-grid");
            image.onclick = function () { imageOffset.show_controls(this) };

            return image;
        },

        /**
         * Creates the editor table
         */
        addTable: function () {
            // Add all elements from last time
            state.result.innerHTML = localStorage.getItem("images");
            sessionStorage.imagenumb = localStorage.getItem("imagenumb");

            imageInfo.setCellCollection([]);
            state.dyntable.innerHTML = '<thead><td width="80" height="20">Frame 1</td><td width="80" height="20">Frame 2</td><td width="80" height="20">Frame 3</td><td width="80" height="20">Frame 4</td><td width="80" height="20">Frame 5</td><td width="80" height="20">Frame 6</td><td width="80" height="20">Frame 7</td><td width="80" height="20">Frame 8</td></thead>';

            // Stop all objects
            graphicHandler.getPreviewObjects().forEach(object => {
                object.stop();
            })

            // Clear preview array
            graphicHandler.getPreviewObjects().length = [];

            // Loop trough and add rows
            for (let x = 0; x < state.rows.value; x++) {
                /* For every row, add another row to the 2D array in @getSet.js.
                This way, the array is dynamic. */
                imageInfo.getCellCollection().push([]);

                // Create new preview objects
                let temp = new Preview(x + 1, 4);
                graphicHandler.getPreviewObjects().push(temp);
                temp.start();

                // Generate tanle rows
                let table_row = document.createElement('TR');
                state.dyntable.appendChild(table_row);

                for (let y = 0; y <= 7; y++) {
                    // Here we add a tempobject to the grid to store for later usage
                    let tempobject = new ImageObject(x, y);
                    imageInfo.getCellCollection()[x][y] = tempobject;
                    imageInfo.getCellCollection()[x][y].xOffset = 0;
                    imageInfo.getCellCollection()[x][y].yOffset = 0;

                    // Generate table cells
                    let table_cell = document.createElement('TD');
                    table_cell.setAttribute("data-x", x);
                    table_cell.setAttribute("data-y", y);
                    table_cell.classList.add('dropzones')

                    // Generate image
                    image_cell = this.generateImage();

                    // Append all elemments
                    table_cell.appendChild(image_cell);
                    table_row.appendChild(table_cell);
                }
            }

            // Canvas Creation
            let canvas_element = document.createElement('canvas');
            if (state.canvas != null) {
                state.canvas.remove();
            }

            canvas_element.setAttribute("height", state.cell_height.value * state.rows.value);
            canvas_element.setAttribute("width", state.cell_width.value * 8);
            canvas_element.setAttribute("id", "canvas");
            state.ContainerCanvas.appendChild(canvas_element);

            // Reset text element
            state.textarea.value = "";

            // Add to object
            state.addElement(canvas_element);

            // Generate text in textarea
            for (l = 1; l < state.rows.value; l++) {
                state.textarea.value += "Animation " + l + "\n";
            }
            state.textarea.value += "Held";
        }
    }
}()