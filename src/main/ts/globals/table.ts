import Preview from "../preview";
import { globals } from "../setup";

class Table {
	private _settings = globals.config.settings;
	private _state = globals.config.state;
	private _imageCollection = globals.imageCollection;
	private _graphicHandler = globals.graphicHandler;

	/**
	 * Itterates table and inserts images from object
	 */
	iterateTable() {
		for (const row of this._state.frames_editor.rows) {
			for (const cell of row.cells) {
				if (
					cell.classList.contains("dropzones") &&
					this._imageCollection.cellCollection[cell.getAttribute("data-x")][
						cell.getAttribute("data-y")
					].imageSrc != null
				) {
					cell.childNodes[0].src =
						this._imageCollection.cellCollection[cell.getAttribute("data-x")][
							cell.getAttribute("data-y")
						].imageSrc;
				}
			}
		}
	}

	/**
	 * Creates the editor table
	 */
	addTable() {
		// Add all elements from last time
		sessionStorage.imagenumb = localStorage.getItem("imagenumb");

		this._state.frames_editor.innerHTML =
			"<thead id='table_head'><td class=\"rownumb\"><b> Rows </b></td><td width=\"80\" height=\"20\">F1</td><td width=\"80\" height=\"20\">F2</td><td width=\"80\" height=\"20\">F3</td><td width=\"80\" height=\"20\">F4</td><td width=\"80\" height=\"20\">F5</td><td width=\"80\" height=\"20\">F6</td><td width=\"80\" height=\"20\">F7</td><td width=\"80\" height=\"20\">F8</td><td><b>Preview</b></td></thead>";

		// Stop all objects
		this._graphicHandler.previewObjects.forEach((object) => {
			object.pause();
		});

		// Clear arrays
		this._graphicHandler.previewObjects = [];

		// Loop trough and add rows
		for (let x = 0; x < this._state.rows.value; x++) {
			// Generate tanle rows
			const table_row = document.createElement("TR");

			// Create row number
			const rowNumb = document.createElement("th");
			rowNumb.setAttribute("scope", "row");
			rowNumb.className = "rownumb";

			// Create row names
			// TODO: The row name should be able to be hidden
			const rowName = document.createElement("input");
			rowName.setAttribute("type", "text");
			rowName.setAttribute("id", "row_name" + String(x + 1));
			rowName.className = "row-name form-control text-center";
			rowName.setAttribute("value", x + 1 == this._state.rows.value ? "Held" : "R" + String(x + 1));

			// Disable the last row
			if (x + 1 == this._state.rows.value) {
				rowName.setAttribute("disabled", "true");
				rowName.classList.add("row-name-disabled");
			}

			// Create row name arrow
			const rowNameArrow = document.createElement("i");
			rowNameArrow.className = "fas fa-arrow-right position-relative row-name-arrow";
			rowNameArrow.style.padding = "2px 2px";

			// Append all elements
			rowNumb.appendChild(rowName);
			rowNumb.appendChild(rowNameArrow);
			table_row.appendChild(rowNumb);
			this._state.frames_editor.appendChild(table_row);

			// Loop trough and add cells
			for (let y = 0; y <= 7; y++) {
				// Generate table cells
				const table_cell = document.createElement("TD");
				table_cell.setAttribute("data-x", String(x));
				table_cell.setAttribute("data-y", String(y));
				table_cell.classList.add("dropzones");

				// Generate image
				const image_cell = this._graphicHandler.generateImage(this._imageCollection.cellCollection[x][y].imageSrc);

				// Append all elemments
				table_cell.appendChild(image_cell);
				table_row.appendChild(table_cell);
			}

			const previewCell = document.createElement("TD");
			table_row.appendChild(previewCell);

			// Create new preview objects
			const temp = new Preview(x + 1, this._settings.preview_fps, previewCell);
			this._graphicHandler.previewObjects.push(temp);
			temp.start();
		}

		// Canvas Creation
		const canvas_element = document.createElement("canvas");

		// Remove old canvas
		if (this._state.canvas != null) {
			this._state.canvas.remove();
		}

		// Set canvas attributes
		canvas_element.setAttribute(
			"height",
			String(this._state.cell_height.value * this._state.rows.value)
		);
		canvas_element.setAttribute(
			"width",
			String(this._state.cell_width.value * 8)
		);
		canvas_element.setAttribute("id", "canvas");


		// Append canvas and add to state
		this._state.container_canvas.appendChild(canvas_element);
		this._state.addElement(canvas_element);

		// Redraw canvas
		this._graphicHandler.redraw();
	}
}

export default Table;
