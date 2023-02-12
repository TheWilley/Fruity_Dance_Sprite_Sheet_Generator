import { globals } from "../setup";
import CtxMenu from "../libs/ctxmenu.min/ctxmenu.min";
import ImageInfo from "../imageInfo";
import Preview from "../preview";
import $ from "jquery";

class GraphicHandler {
	private _selectedItem: HTMLElement;
	private _previousObject: HTMLElement = null;
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
			const multiplier = 10;

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
						cell_width * multiplier,
						cell_height * multiplier
					);
			}

			// Drawing of image
			GeneratedCanvas.onload = function () {
				ctx.drawImage(
					GeneratedCanvas,
					cell_width * cellnumb + Number(Xoffset),
					cell_height * rownumb + Number(Yoffset),
					cell_width * multiplier,
					cell_height * multiplier
				);
			};
		}
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
		const image = document.createElement("IMG");

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
		const currentObject = this._selectedItem;
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
			"partOfCanvas"
		);

		// Step 2, remove from array
		this._imageCollection.cellCollection[rownumb][cellnumb] = new ImageInfo(
			rownumb,
			cellnumb
		);
		this._imageCollection.cellCollection[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
		this._imageCollection.cellCollection[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset

		// Step 3, remove regenerate and remove from grid
		currentObject.parentNode.appendChild(this.generateImage());
		currentObject.remove();

		// Step 4, redraw
		this.redraw();

		// Step 5, disable controls
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
			this._state.delete.style.outline = "3px dashed red";
		} else {
			this._state.popup.style.transform = "translate(-50%, 150px)";
			this._state.mouse_circle.style.opacity = "0%";
			this._state.delete.style.outline = "none";
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
			for (let i = 0; i < this._settings.amountOfCollections; i++) {
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

	/**
	 * Enables or disables the offset & delete settings
	 * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
	 */
	public disableControls(enabled: boolean) {
		this._state.offset_x.disabled = enabled;
		this._state.offset_y.disabled = enabled;
		this._state.delete.disabled = enabled;
	}

	/**
	 * Shows controls for a cell in the table
	 * @param {object} currentObject - The target image element in the table
	 */
	public show_controls(currentObject: HTMLElement) {
		this._selectedItem = currentObject;

		// Disable controls if the image src is not found
		if (currentObject.getAttribute("src") == null) {
			this.disableControls(true);
		} else {
			this.disableControls(false);
		}

		// Get row / cell number
		const rownumb = Number(currentObject.parentElement.dataset.x);
		const cellnumb = Number(currentObject.parentElement.dataset.y);

		// Unbind all events
		if (currentObject != this._previousObject) {
			$(this._state.offset_x).unbind();
			$(this._state.offset_y).unbind();
		}

		// Check if object has been accessed before
		if (this._previousObject != null) {
			this._previousObject.style.border = "1px solid gray";
		}

		// Make the previous object the current one
		this._previousObject = currentObject;

		// Apply green border
		currentObject.style.border = "green solid 3px";

		// Get offset
		if (this._previousObject != null) {
			// Get stored values
			const Xoffset =
				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset;
			const Yoffset =
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset;

			// Set values
			this._state.offset_x.value = Xoffset;
			this._state.offset_y.value = Yoffset;

			$([this._state.offset_x, this._state.offset_y]).on("change", (event) => {
				this.checkMinMax(event);
				this._imageCollection.cellCollection[rownumb][cellnumb].xOffset =
					this._state.offset_x.value;
				this._imageCollection.cellCollection[rownumb][cellnumb].yOffset =
					this._state.offset_y.value;
				this.redraw();
			});
		}
	}

	/**
	 * Checks if the current value is under its minimum / over its maximum
	 * @param {object} event
	 */
	checkMinMax(event: JQuery.ChangeEvent) {
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

	/**
	 * Shows or hides preview columns in table
	 */
	public show_preview() {
		const root = document.documentElement;
		root.style.getPropertyValue("--show_preview") == "none"
			? root.style.setProperty("--show_preview", "block")
			: root.style.setProperty("--show_preview", "none");
	}

	public get selectedItem() {
		return this._selectedItem;
	}

	public set selectedItem(value) {
		this._selectedItem = value;
	}

	public get previewObjects() {
		return this._previewObjects;
	}

	public set previewObjects(value) {
		this._previewObjects = value;
	}
}

export default GraphicHandler;
