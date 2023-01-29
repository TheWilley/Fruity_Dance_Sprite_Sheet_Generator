import { config } from "../../app";
import ImageCollection from "./imageCollection";
import GraphicHandler from "./graphicHandler";
import Preview from "./preview";
import ImageInfo from "./imageInfo";

class Table {
    private _settings = config.settings
    private _state = config.state
    private _imageCollection = new ImageCollection()
    private _graphicHandler = new GraphicHandler()

    /**
     * Itterates table and inserts images from object
     */
    iterateTable() {
        for (let row of this._state.dyntable.rows) {
            for (let cell of row.cells) {
                if (cell.classList.contains("dropzones") && this._imageCollection.cellCollection[cell.getAttribute("data-x")][cell.getAttribute("data-y")].imageSrc != null) {
                    cell.childNodes[0].src = this._imageCollection.cellCollection[cell.getAttribute("data-x")][cell.getAttribute("data-y")].imageSrc
                }
            }
        }
    }

    /**
     * Checks if all cells are empty in the table
     * @returns True | False
     */
    checkEmptyCells() {
        // Check if there is any image added and warn user
        var allCellsEmpty = true;

        this._imageCollection.cellCollection.forEach(e1 => {
            e1.forEach(e2 => {
                if (e2.imageSrc != "") {
                    allCellsEmpty = false;
                }
            })
        })

        if (!allCellsEmpty) {
            if (!confirm('This action will discard your sprite sheet! Continue?')) {
                return false;
            }
        }

        return true
    }

    /**
     * Creates the editor table
     */
    addTable() {
        // Add all elements from last time
        this._state.result.innerHTML = localStorage.getItem("images");
        sessionStorage.imagenumb = localStorage.getItem("imagenumb");

        this._imageCollection.cellCollection = [];
        this._state.dyntable.innerHTML = '<thead><td class="rownumb"> Row </td><td width="80" height="20">Frame 1</td><td width="80" height="20">Frame 2</td><td width="80" height="20">Frame 3</td><td width="80" height="20">Frame 4</td><td width="80" height="20">Frame 5</td><td width="80" height="20">Frame 6</td><td width="80" height="20">Frame 7</td><td width="80" height="20">Frame 8</td><td>Preview</td></thead>';

        // Stop all objects
        this._graphicHandler.previewObjects.forEach(object => {
            object.stop();
        })

        // Clear preview array
        this._graphicHandler.previewObjects = [];

        // Loop trough and add rows
        for (let x = 0; x < this._state.rows.value; x++) {
            /* For every row, add another row to the 2D array in @getSet.js.
            This way, the array is dynamic. */
            this._imageCollection.cellCollection.push([]);

            // Generate tanle rows
            let table_row = document.createElement('TR');

            // Create row number
            let rowNumb = document.createElement("th");
            rowNumb.setAttribute("scope", "row");
            rowNumb.className = "rownumb"
            rowNumb.innerHTML = x + 1 == this._state.rows.value ? "Held" : String(x + 1);
            table_row.appendChild(rowNumb);
            this._state.dyntable.appendChild(table_row);

            for (let y = 0; y <= 7; y++) {
                // Here we add a tempobject to the grid to store for later usage
                let tempobject = new ImageInfo(x, y);
                this._imageCollection.cellCollection[x][y] = tempobject;
                this._imageCollection.cellCollection[x][y].xOffset = 0;
                this._imageCollection.cellCollection[x][y].yOffset = 0;

                // Generate table cells
                let table_cell = document.createElement('TD');
                table_cell.setAttribute("data-x", String(x));
                table_cell.setAttribute("data-y", String(y));
                table_cell.classList.add('dropzones')

                // Generate image
                const image_cell = this._graphicHandler.generateImage();

                // Append all elemments
                table_cell.appendChild(image_cell);
                table_row.appendChild(table_cell);
            }

            const previewCell = document.createElement('TD');
            table_row.appendChild(previewCell);

            // Create new preview objects
            // TODO: Make this work
            //const temp = new Preview(x + 1, this._settings.previewFPS, previewCell);
            //this._graphicHandler.previewObjects.push(temp);
            //temp.start();
        }

        // Canvas Creation
        let canvas_element = document.createElement('canvas');
        
        if (this._state.canvas != null) {
            this._state.canvas.remove();
        }
        
        canvas_element.setAttribute("height", String(this._state.cell_height.value * this._state.rows.value));
        canvas_element.setAttribute("width", String(this._state.cell_width.value * 8));
        canvas_element.setAttribute("id", "canvas");
        this._state.addElement(canvas_element)
        console.log(this._state)

        this._state.ContainerCanvas.appendChild(canvas_element);

        // Reset text element
        this._state.textarea.value = "";

        // Add to object
        this._state.addElement(canvas_element);

        // Generate text in textarea
        for (var line = 1; line < this._state.rows.value; line++) {
            this._state.textarea.value += `Animation ${line} \n`;
        }
        this._state.textarea.value += "Held";
    }
}

export default Table