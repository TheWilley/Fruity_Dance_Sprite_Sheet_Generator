import GraphicHandler from "./graphicHandler";

class imageOffset {
    previousObject: HTMLElement = null
    state = new Configuration().state
    imageInfo = new ImageCollection()
    graphicHandler = new GraphicHandler()
    eventListeners = new EventListeners()

    /**
     * Enables or disables the offset & delete settings
     * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
     */
    public disableControls(enabled: boolean) {
        this.state.offsetX.disabled = enabled;
        this.state.offsetY.disabled = enabled;
        this.state.delete.disabled = enabled;
    }

    /**
     * Shows controls for a cell in the table
     * @param {object} currentObject - The target image element in the table
     */
    public show_controls(currentObject: HTMLElement) {
        const self = this

        this.graphicHandler.selectedItem = currentObject;
        eventListeners
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
        if (currentObject != this.previousObject) {
            $(this.state.offsetX).unbind();
            $(this.state.offsetY).unbind();
        }

        // Check if object has been accessed before
        if (this.previousObject != null) { this.previousObject.style.border = "1px solid gray" };

        // Make the previous object the current one
        this.previousObject = currentObject;

        // Apply green border
        currentObject.style.border = "green solid 3px";

        // Get offset
        if (this.previousObject != null) {
            // Get stored values
            const Xoffset = this.imageInfo.cellCollection[rownumb][cellnumb].xOffset;
            const Yoffset = this.imageInfo.cellCollection[rownumb][cellnumb].yOffset;

            // Set values
            this.state.offsetX.value = Xoffset;
            this.state.offsetY.value = Yoffset;

            $([this.state.offsetX, this.state.offsetY]).change(function (event) {
                eventListeners.checkMinMax(event);

                self.imageInfo.cellCollection[rownumb][cellnumb].xOffset = this.state.offsetX.value;
                self.imageInfo.cellCollection[rownumb][cellnumb].yOffset = this.state.offsetY.value;
                self.graphicHandler.redraw()
            })
        }
    }
}