import { config } from "../../app";
import CtxMenu from './libs/ctxmenu.min/ctxmenu.min'
import ImageCollection from './imageCollection';
import ImageInfo from './imageInfo';
import Preview from './preview';

class GraphicHandler {
    private _selectedItem: HTMLElement;
    private _previousObject: HTMLElement = null
    private _previewObjects: Preview[] = [];
    private _state = config.state
    private _settings = config.settings
    private _imageCollection = new ImageCollection()

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
    public generateCanvas(image: string, rownumb: number, cellnumb: number, Xoffset?: number, Yoffset?: number, clear?: 'wholeCanvas' | 'partOfCanvas') {
        // This is where we create the canvas and insert images
        let GeneratedCanvas = new Image();
        GeneratedCanvas.src = image;

        if (this._state.canvas.getContext) {
            const ctx = this._state.canvas.getContext('2d');

            // Get width and height
            let cell_width = parseInt(this._state.cell_width.value);
            let cell_height = parseInt(this._state.cell_height.value);

            // Check if whole canvas is being cleared or only part of it
            switch (clear) { case "wholeCanvas": ctx.clearRect(0, 0, this._state.canvas.width, this._state.canvas.height); case "partOfCanvas": ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height) }

            // Drawing of image
            GeneratedCanvas.onload = function () {
                ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
            };
        }
    }

    /**
     * Redraws canvas
     */
    public redraw() {
        this._imageCollection.cellCollection.forEach(row => {
            // TODO: Change this to a interface
            row.forEach((cell: { imageSrc: string; x: number; y: number; xOffset: number; yOffset: number; }) => {
                if (cell.imageSrc != undefined) {
                    this.generateCanvas(cell.imageSrc, cell.x, cell.y, cell.xOffset, cell.yOffset, "wholeCanvas")
                }
            });
        })
    }

    /**
     * Generates an image element
     * @returns {object} - The image element
    */
    public generateImage() {
        const self = this

        // Generate image cells
        let image = document.createElement('IMG');

        // Set all image_cell attributes
        image.setAttribute("class", "immg-grid");
        // @ts-ignore - TODO: Have to check how "this" can relate to the DOM here
        image.onclick = function () { self._imageOffset.show_controls(this) };

        return image;
    }

    /**
     * Removes an image from the table
     */
    public remove() {
        const currentObject = this._selectedItem;
        // Get row / cell number
        var rownumb = Number(currentObject.parentElement.dataset.x);
        var cellnumb = Number(currentObject.parentElement.dataset.y);

        // Step 1, remove from canvas
        this.generateCanvas(null, rownumb, cellnumb, this._imageCollection.cellCollection[rownumb][cellnumb].xOffset, this._imageCollection.cellCollection[rownumb][cellnumb].yOffset, "partOfCanvas");

        // Step 2, remove from array
        this._imageCollection.cellCollection[rownumb][cellnumb] = new ImageInfo(rownumb, cellnumb);
        this._imageCollection.cellCollection[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
        this._imageCollection.cellCollection[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset

        // Step 3, remove regenerate and remove from grid
        currentObject.parentNode.appendChild(this.generateImage());
        currentObject.remove();

        // Step 4, redraw
        this.redraw()

        // Step 5, disable controls
        this.disableControls(true)
    }

    /**
     * Restarts or stops the preview
     * @param {boolean} restart - True: Restart preview; False: Stop preview;
     */
    public configPreview(restart: boolean) {
        if (restart == true) {
            this._previewObjects.forEach((obj) => {
                if (obj.getPauseState == true) {
                    obj.restart()
                }
            })
        } else {
            this._previewObjects.forEach(obj => {
                obj.stop()
            })
        }
    }

    /**
     * Start or stop the preview of an image when draging an image
     * @param {*} preview - True: Start preview; False: Stop preview;
     */
    public previewImage(preview: boolean) {
        if (preview) {
            this._state.popup.style.transform = "translate(-50%, 300px)";
            this._state.mouseCircle.style.opacity = "100%";
            this._state.delete.style.outline = "3px dashed red"
        } else {
            this._state.popup.style.transform = "translate(-50%, 150px)";
            this._state.mouseCircle.style.opacity = "0%"
            this._state.delete.style.outline = "none"
        };
    }

    /**
     * Only show elements based on which collection user wants to see 
     */
    public filterClass() {
        const allThumbnails = document.querySelectorAll<HTMLElement>(".thumbnail")
        for (const element of allThumbnails) {
            if (!element.classList.contains(this._state.collection.value)) {
                element.style.display = "none"
            } else {
                element.style.display = "block"
            }
        }
        localStorage.setItem("images", this._state.result.innerHTML);
    }

    /**
     * Context menu creation 
     */
    public ctx() {
        const self = this
        const contextMenu = CtxMenu(".thumbnail");

        /**
         * Generates an array for the options in the context menu
         * @returns {Array} - An array with <option/> elements
         */
        const classNames = function () {
            var temp = []
            for (let i = 0; i < self._settings.amountOfCollections; i++) {
                temp.push(`col${i}`)

                contextMenu.addItem(`Collection ${i}`, function () {
                    changeClass(contextMenu._elementClicked, `col${i}`)
                });

                var option = document.createElement("option");
                option.value = `col${i}`;
                option.innerHTML = `Collection ${i}`;
                self._state.collection.appendChild(option)

                self.filterClass()
            }
            return temp;
        }()

        /**
         * Changes the class name of an element and removed old ones based on `classNames`
         * @param {Object} element - The element to change class of
         * @param {string} className - The new class name
         */
        const changeClass = function (element: HTMLElement, className: string) {
            for (const name of classNames) {
                if (name != className) {
                    element.classList.remove(name)
                    this._imageCollection.filterClass()
                }

            }
        }
    }


    /**
     * Enables or disables the offset & delete settings
     * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
     */
    public disableControls(enabled: boolean) {
        this._state.offsetX.disabled = enabled;
        this._state.offsetY.disabled = enabled;
        this._state.delete.disabled = enabled;
    }

    /**
     * Shows controls for a cell in the table
     * @param {object} currentObject - The target image element in the table
     */
    public show_controls(currentObject: HTMLElement) {
        const self = this

        this._selectedItem = currentObject;

        // Disable controls if the image src is not found
        if (currentObject.getAttribute("src") == null) {
            this.disableControls(true);
        } else {
            this.disableControls(false);
        }

        // Get row / cell number
        var rownumb: number = Number(currentObject.parentElement.dataset.x);
        var cellnumb: number = Number(currentObject.parentElement.dataset.y);

        // Unbind all events
        if (currentObject != this._previousObject) {
            $(this._state.offsetX).unbind();
            $(this._state.offsetY).unbind();
        }

        // Check if object has been accessed before
        if (this._previousObject != null) { this._previousObject.style.border = "1px solid gray" };

        // Make the previous object the current one
        this._previousObject = currentObject;

        // Apply green border
        currentObject.style.border = "green solid 3px";

        // Get offset
        if (this._previousObject != null) {
            // Get stored values
            const Xoffset = this._imageCollection.cellCollection[rownumb][cellnumb].xOffset;
            const Yoffset = this._imageCollection.cellCollection[rownumb][cellnumb].yOffset;

            // Set values
            this._state.offsetX.value = Xoffset;
            this._state.offsetY.value = Yoffset;

            $([this._state.offsetX, this._state.offsetY]).on('change', function (event) {
                self.checkMinMax(event);

                self._imageCollection.cellCollection[rownumb][cellnumb].xOffset = this.state.offsetX.value;
                self._imageCollection.cellCollection[rownumb][cellnumb].yOffset = this.state.offsetY.value;
                self.redraw()
            })
        }
    }


    /**
     * Checks if the current value is under its minimum / over its maximum
     * @param {object} event 
     */
    checkMinMax(event: JQuery.ChangeEvent) {
        if (parseInt((event.target as HTMLInputElement).value) > parseInt((event.target as HTMLInputElement).getAttribute("max"))) { var target = event.target as HTMLInputElement; target.value = (event.target as HTMLInputElement).getAttribute("max") };
        if (parseInt((event.target as HTMLInputElement).value) < parseInt((event.target as HTMLInputElement).getAttribute("min"))) { var target = event.target as HTMLInputElement; target.value = (event.target as HTMLInputElement).getAttribute("min") };
    }

    /**
     * Shows or hides preview columns in table
     */
    public showPreview() {
        let root = document.documentElement;
        root.style.getPropertyValue("--showPreview") == "none" ? root.style.setProperty("--showPreview", "block") : root.style.setProperty("--showPreview", "none")
    }

    /*/ Getters /*/
    public get selectedItem() {
        return this._selectedItem;
    }

    public get previewObjects() {
        return this._previewObjects;
    }

    /*/ Setters /*/
    public set selectedItem(value) {
        this._selectedItem = value;
    }


    public set previewObjects(value) {
        this._previewObjects = value;
    }
}

export default GraphicHandler