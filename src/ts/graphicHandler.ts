import { Configuration } from "./config";
import Preview from "./preview";
import CtxMenu from './dist/ctxmenu.min/ctxmenu.min'

class graphicHandler {
    private selectedItem: HTMLElement;
    private previewObjects: Preview[] = [];
    private state = new Configuration().state
    private settings = new Configuration().settings

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
    public generateCanvas(image: string, rownumb: number, cellnumb: number, Xoffset = 0, Yoffset = 0, clear: 'wholeCanvas' | 'partOfCanvas') {
        // This is where we create the canvas and insert images
        let GeneratedCanvas = new Image();
        GeneratedCanvas.src = image;

        if (this.state.canvas.getContext) {
            const ctx = this.state.canvas.getContext('2d');

            // Get width and height
            let cell_width = parseInt(this.state.cell_width.value);
            let cell_height = parseInt(this.state.cell_height.value);

            // Check if whole canvas is being cleared or only part of it
            switch (clear) { case "wholeCanvas": ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height); case "partOfCanvas": ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height) }

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
        imageInfo.getCellCollection().forEach(row => {
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
        const currentObject = this.selectedItem;
        // Get row / cell number
        var rownumb = Number(currentObject.parentElement.dataset.x);
        var cellnumb = Number(currentObject.parentElement.dataset.y);

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
    }

    /**
     * Restarts or stops the preview
     * @param {boolean} restart - True: Restart preview; False: Stop preview;
     */
    public configPreview(restart: boolean) {
        if (restart == true) {
            this.previewObjects.forEach((obj) => {
                if (obj.getPauseState == true) {
                    obj.restart()
                }
            })
        } else {
            this.previewObjects.forEach(obj => {
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
            this.state.popup.style.transform = "translate(-50%, 300px)";
            this.state.mouseCircle.style.opacity = "100%";
            this.state.delete.style.outline = "3px dashed red"
        } else {
            this.state.popup.style.transform = "translate(-50%, 150px)";
            this.state.mouseCircle.style.opacity = "0%"
            this.state.delete.style.outline = "none"
        };
    }

    /**
     * Only show elements based on which collection user wants to see 
     */
    public filterClass() {
        const allThumbnails = document.querySelectorAll<HTMLElement>(".thumbnail")
        for (const element of allThumbnails) {
            if (!element.classList.contains(this.state.collection.value)) {
                element.style.display = "none"
            } else {
                element.style.display = "block"
            }
        }
        localStorage.setItem("images", this.state.result.innerHTML);
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
                } else {
                    element.classList.add(className)
                }
            }
            self.filterClass()
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
    public get SelectedItem() {
        return this.selectedItem;
    }

    public get PreviewObjects() {
        return this.previewObjects;
    }

    /*/ Setters /*/
    public set SelectedItem(e) {
        this.selectedItem = e;
    }
}