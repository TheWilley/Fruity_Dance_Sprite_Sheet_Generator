import { config } from "./globals"
import EventListeners from "./eventListeners";
import GraphicHandler from "./graphicHandler";
import ImageCollection from "./imageCollection";

class ImageOffset {
    private _previousObject: HTMLElement = null
    private _state = config.state
    private _imageInfo = new ImageCollection()
    private _graphicHandler = new GraphicHandler()
    private _eventListeners = new EventListeners()

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

        this._graphicHandler.selectedItem = currentObject;
        
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
            const Xoffset = this._imageInfo.cellCollection[rownumb][cellnumb].xOffset;
            const Yoffset = this._imageInfo.cellCollection[rownumb][cellnumb].yOffset;

            // Set values
            this._state.offsetX.value = Xoffset;
            this._state.offsetY.value = Yoffset;

            $([this._state.offsetX, this._state.offsetY]).on('change', function (event) {
                self._eventListeners.checkMinMax(event);

                self._imageInfo.cellCollection[rownumb][cellnumb].xOffset = this.state.offsetX.value;
                self._imageInfo.cellCollection[rownumb][cellnumb].yOffset = this.state.offsetY.value;
                self._graphicHandler.redraw()
            })
        }
    }
}

export default ImageOffset