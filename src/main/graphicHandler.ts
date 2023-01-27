import Configuration from './config';
import CtxMenu from './dist/ctxmenu.min/ctxmenu.min'
import ImageCollection from './imageCollection';
import ImageInfo from './imageInfo';
import Preview from './preview';
import ImageOffset from './imageOffset';
import Table from './table';

class GraphicHandler {
    private _selectedItem: HTMLElement;
    private _previewObjects: Preview[] = [];
    private _state = new Configuration().state
    private _imageCollection = new ImageCollection()
    private _imageOffset = new ImageOffset()
    private _table = new Table()

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
        currentObject.parentNode.appendChild(this._table.generateImage());
        currentObject.remove();

        // Step 4, redraw
        this.redraw()

        // Step 5, disable controls
        this._imageOffset.disableControls(true)
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
            for (let i = 0; i < this.config.settings.amountOfCollections; i++) {
                temp.push(`col${i}`)

                contextMenu.addItem(`Collection ${i}`, function () {
                    changeClass(contextMenu._elementClicked, `col${i}`)
                });

                var option = document.createElement("option");
                option.value = `col${i}`;
                option.innerHTML = `Collection ${i}`;
                this.state.collection.appendChild(option)

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