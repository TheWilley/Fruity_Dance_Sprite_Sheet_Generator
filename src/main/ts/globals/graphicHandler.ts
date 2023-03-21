import { globals } from "../setup";
import CtxMenu from "../libs/ctxmenu.min/ctxmenu.min";
import ImageInfo from "../imageInfo";
import Preview from "../preview";
import $ from "jquery";

class GraphicHandler {
	private _selectedItems: HTMLElement[] = [];
	private _previousValues = {
		Xoffset: 0,
		Yoffset: 0,
		sizeMultiplier: 0,
	};
	private _previewObjects: Preview[] = [];
	private _state = globals.config.state;
	private _settings = globals.config.settings;
	private _imageCollection = globals.imageCollection;

	constructor() {
		sessionStorage.imagenumb = 0;
	}

	/**
	 * Inserts an image to the canvas
	 * @param {string} image - The image src
	 * @param {number} rownumb - The row number (Y)
	 * @param {number} cellnumb - The cell number (X)
	 * @param {number} Xoffset - The image offset in the X axis
	 * @param {number} Yoffset - The image offset in the Y axis
	 * @param {('wholeCanvas'|'partOfCanvas')} clear - How much of the canvas to be cleared
	 */
	public generateCanvas(
		image: string,
		rownumb: number,
		cellnumb: number,
		Xoffset?: number,
		Yoffset?: number,
		sizeMultiplier?: number,
		clear?: "wholeCanvas" | "partOfCanvas"
	) {
		// This is where we create the canvas and insert images
		const GeneratedCanvas = new Image();
		GeneratedCanvas.src = image;

		if (this._state.canvas.getContext) {
			const ctx = this._state.canvas.getContext("2d");

			// Get width and height
			const cell_width = parseInt(this._state.cell_width.value);
			const cell_height = parseInt(this._state.cell_height.value);

			// Check if whole canvas is being cleared or only part of it
			switch (clear) {
				case "wholeCanvas":
					ctx.clearRect(
						0,
						0,
						this._state.canvas.width,
						this._state.canvas.height
					);
					break;
				case "partOfCanvas":
					ctx.clearRect(
						cell_width * cellnumb + Number(Xoffset),
						cell_height * rownumb + Number(Yoffset),
						cell_width * sizeMultiplier,
						cell_height * sizeMultiplier
					);
			}

			// Drawing of image
			GeneratedCanvas.onload = function () {
				ctx.drawImage(
					GeneratedCanvas,
					cell_width * cellnumb + Number(Xoffset),
					cell_height * rownumb + Number(Yoffset),
					cell_width * sizeMultiplier,
					cell_height * sizeMultiplier
				);
			};
		}
	}

	/**
	 * Clears the canvas manually
	 */
	private clearCanvasManual() {
		const ctx = this._state.canvas.getContext("2d");
		ctx.clearRect(
			0,
			0,
			this._state.canvas.width,
			this._state.canvas.height
		);
	}

	/**
	 * Redraws canvas
	 */
	public redraw() {
		this._imageCollection.cellCollection.forEach((row) => {
			// TODO: Change this to a interface
			row.forEach((cell) => {
				if (cell.imageSrc != undefined) {
					this.generateCanvas(
						cell.imageSrc,
						cell.x,
						cell.y,
						cell.xOffset,
						cell.yOffset,
						cell.sizeMultiplier,
						"wholeCanvas"
					);
				}
			});
		});
	}

	/**
	 * Generates an image element
	 * @returns {object} - The image element
	 */
	public generateImage() {
		// Generate image cells
		const image = document.createElement("IMG") as HTMLImageElement;

		// Set all image_cell attributes
		image.setAttribute("class", "immg-grid");
		image.onclick = (event) => {
			this.show_controls(event.target as HTMLElement);
		};

		return image;
	}

	/**
	 * Removes an image from the table
	 */
	public remove() {
		for (const item of this._selectedItems) {
			const currentObject = item;
			// Get row / cell number
			const rownumb = Number(currentObject.parentElement.dataset.x);
			const cellnumb = Number(currentObject.parentElement.dataset.y);

			// Step 1, remove from canvas
			this.generateCanvas(
				null,
				rownumb,
				cellnumb,
				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset,
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset,
				this._imageCollection.cellCollection[rownumb][cellnumb].sizeMultiplier,
				"partOfCanvas"
			);

			// Step 2, remove from array
			this._imageCollection.cellCollection[rownumb][cellnumb] = new ImageInfo(
				rownumb,
				cellnumb
			);
			this._imageCollection.cellCollection[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
			this._imageCollection.cellCollection[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset
			this._imageCollection.cellCollection[rownumb][
				cellnumb
			].sizeMultiplier = 1; // Needed to avoid an error regarding null offset

			// Step 3, remove regenerate and remove from grid
			currentObject.parentNode.appendChild(this.generateImage());
			currentObject.remove();

			// Step 4, remove from selected items
			// Since we are removing all selected items anyways, we can just clear the array
			this._selectedItems = [];
		}

		// Step 5, redraw
		this.redraw();

		// Step 6, disable controls
		this.disableControls(true);
	}

	/**
	 * Restarts or stops the preview
	 * @param {boolean} restart - True: Restart preview; False: Stop preview;
	 */
	public configPreview(restart: boolean) {
		if (restart == true) {
			this._previewObjects.forEach((obj) => {
				if (obj.getPauseState == true) {
					obj.restart();
				}
			});
		} else {
			this._previewObjects.forEach((obj) => {
				obj.pause();
			});
		}
	}

	/**
	 * Start or stop the preview of an image when draging an image
	 * @param {*} preview - True: Start preview; False: Stop preview;
	 */
	public previewImage(preview: boolean) {
		if (preview) {
			this._state.popup.style.transform = "translate(-50%, 300px)";
			this._state.mouse_circle.style.opacity = "100%";
			this._state.delete.style.outline = "2px solid red";
			this._state.delete.style.borderColor = "red";
		} else {
			this._state.popup.style.transform = "translate(-50%, 150px)";
			this._state.mouse_circle.style.opacity = "0%";
			this._state.delete.style.outline = "none";
			this._state.delete.style.borderColor = "#ffc107";
		}
	}

	/**
	 * Only show elements based on which collection user wants to see
	 */
	public filterClass() {
		const allThumbnails = document.querySelectorAll<HTMLElement>(".thumbnail");
		for (const element of allThumbnails) {
			if (!element.classList.contains(this._state.collection.value)) {
				element.parentElement.style.display = "none";
			} else {
				element.parentElement.style.display = "block";
			}
		}
		localStorage.setItem("images", this._state.result.innerHTML);
	}

	/**
	 * Context menu creation
	 */
	public ctx() {
		const contextMenu = CtxMenu(".thumbnail");

		/**
		 * Generates an array for the options in the context menu
		 * @returns {Array} - An array with <option/> elements
		 */
		const classNames = (() => {
			const temp = [];
			for (let i = 0; i < this._settings.amount_of_collections; i++) {
				temp.push(`col${i}`);

				contextMenu.addItem(`Collection ${i}`, function () {
					changeClass(contextMenu._elementClicked, `col${i}`);
				});

				const option = document.createElement("option");
				option.value = `col${i}`;
				option.innerHTML = `Collection ${i}`;
				this._state.collection.appendChild(option);

				this.filterClass();
			}
			return temp;
		})();

		/**
		 * Changes the class name of an element and removed old ones based on `classNames`
		 * @param {Object} element - The element to change class of
		 * @param {string} className - The new class name
		 */
		const changeClass = (element: HTMLElement, className: string) => {
			for (const name of classNames) {
				if (name != className) {
					element.classList.add(className);
					element.classList.remove(name);
					this.filterClass();
				}
			}
		};
	}

	public flipVertical() {
		this._selectedItems.forEach((item) => {

		});
	}

	/**
	 * Enables or disables the offset & delete settings
	 * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
	 */
	public disableControls(enabled: boolean) {
		this._state.offset_x.disabled = enabled;
		this._state.offset_y.disabled = enabled;
		this._state.size_multiplier.disabled = enabled;
		this._state.delete.disabled = enabled;
		this._state.flip_horizontal.disabled = enabled;
		this._state.flip_vertical.disabled = enabled;
	}

	/**
	 * Shows controls for a cell in the table
	 * @param {object} currentObject - The target image element in the table
	 */
	public show_controls(currentObject: HTMLElement) {
		/**
		 * Disables controls if all selected items are null
		 */
		const disableIfAllNull = () => {
			// Disable controls if the image src is not found
			let disabledItems = 0;
			for (const item of this._selectedItems) {
				if (item.getAttribute("src") == null) {
					disabledItems++;
				}
			}
			if (disabledItems == this._selectedItems.length) {
				this.disableControls(true);
			} else {
				this.disableControls(false);
			}
		};

		/**
		 * Handles the selection of a itemm
		 */
		const selectionHandler = () => {
			// Apply green border
			currentObject.style.border = "green solid 3px";

			// Check if current object exist in the array
			if (this._selectedItems.includes(currentObject)) {
				// Remove the border
				currentObject.style.border = "none";

				// Remove the current object from the array
				this._selectedItems.splice(
					this._selectedItems.indexOf(currentObject),
					1
				);
			} else {
				this._selectedItems.push(currentObject);
			}
		};

		// Handle selection graphics
		selectionHandler();
		disableIfAllNull();

		// Unbind all events
		$(this._state.offset_x).unbind();
		$(this._state.offset_y).unbind();
		$(this._state.size_multiplier).unbind();

		// Go through all selected items
		for (const item of this._selectedItems) {
			// Get row / cell number
			const rownumb = Number(item.parentElement.dataset.x);
			const cellnumb = Number(item.parentElement.dataset.y);

			// Get stored values
			const Xoffset =
				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset;
			const Yoffset =
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset;
			const sizeMultiplier =
				this._imageCollection.cellCollection[rownumb][cellnumb].sizeMultiplier;

			// Set values
			this._state.offset_x.value = Xoffset;
			this._state.offset_y.value = Yoffset;
			this._state.size_multiplier.value = sizeMultiplier;

			// Store previous values
			this._previousValues = {
				Xoffset: this._state.offset_x.value,
				Yoffset: this._state.offset_y.value,
				sizeMultiplier: this._state.size_multiplier.value,
			};

			// Bind events to the controls
			$([
				this._state.offset_x,
				this._state.offset_y,
				this._state.size_multiplier
			]).on("change", () => {
				const offsets = {
					Xoffset: this._state.offset_x.value - this._previousValues.Xoffset,
					Yoffset: this._state.offset_y.value - this._previousValues.Yoffset,
					sizeMultiplier: this._state.size_multiplier.value - this._previousValues.sizeMultiplier,
				};


				// Update the values
				// Offset = current value - previous value
				// X = (current value - previous value) + (previous value + offset)
				// For example: (2 - 3) + (3 + 1) = 1
				// This makes each image move by the offset value relative to its previous value instead of the current value
				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset = Number(((Xoffset - Number(this._previousValues.Xoffset)) + (Number(this._previousValues.Xoffset) + offsets.Xoffset)).toFixed(1));
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset = Number(((Yoffset - Number(this._previousValues.Yoffset)) + (Number(this._previousValues.Yoffset) + offsets.Yoffset)).toFixed(1));
				this._imageCollection.cellCollection[rownumb][cellnumb].sizeMultiplier = Number(((sizeMultiplier - Number(this._previousValues.sizeMultiplier)) + (Number(this._previousValues.sizeMultiplier) + offsets.sizeMultiplier)).toFixed(1));

				// Check that we are not over the maximum value
				const correctedValues = this.checkMinMax(this._imageCollection.cellCollection[rownumb][cellnumb].xOffset, this._imageCollection.cellCollection[rownumb][cellnumb].yOffset);

				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset = correctedValues[0];
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset = correctedValues[1];
			});
		}

		// Add an additional event for redrawing the image as putting this in the loop above causes the image to be redrawn multiple times per change
		$([
			this._state.offset_x,
			this._state.offset_y,
			this._state.size_multiplier
		]).on("change", () => {
			this.redraw();
		});
	}

	/**
	 * Checks if the current value is under its minimum / over its maximum
	 * @param {object} event
	 */
	checkMinMax(xOffset?: number, Yoffset?: number, event?: JQuery.ChangeEvent) {
		// If there is an event, check against the html element value directly
		if (event) {
			if (
				parseInt((event.target as HTMLInputElement).value) >
				parseInt((event.target as HTMLInputElement).getAttribute("max"))
			) {
				const target = event.target as HTMLInputElement;
				target.value = (event.target as HTMLInputElement).getAttribute("max");
			}
			if (
				parseInt((event.target as HTMLInputElement).value) <
				parseInt((event.target as HTMLInputElement).getAttribute("min"))
			) {
				const target = event.target as HTMLInputElement;
				target.value = (event.target as HTMLInputElement).getAttribute("min");
			}
		}
		// If there is no event, check against the stored values
		else {
			// Check that we are not over the maximum or under the minimum value for the x offset
			const new_Xoffset =
				(xOffset < this._settings.min_x_offset) ? this._settings.min_x_offset :
					(xOffset > this._settings.max_x_offset) ? this._settings.max_x_offset :
						xOffset;

			// Check that we are not over the maximum or under the minimum value for the y offset			
			const new_Yoffset =
				(Yoffset < this._settings.min_y_offset) ? this._settings.min_y_offset :
					(Yoffset > this._settings.max_y_offset) ? this._settings.max_y_offset :
						Yoffset;

			return [new_Xoffset, new_Yoffset];
		}
	}

	/**
	 * Shows or hides preview columns in table
	 */
	public show_preview() {
		const root = document.documentElement;
		root.style.getPropertyValue("--show_preview") == "none"
			? root.style.setProperty("--show_preview", "block")
			: root.style.setProperty("--show_preview", "none");
	}

	public get previewObjects() {
		return this._previewObjects;
	}

	public set previewObjects(value) {
		this._previewObjects = value;
	}
}

export default GraphicHandler;
