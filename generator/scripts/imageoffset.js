var imageOffset = function () {
    var previousObject = null

    return {
        /**
         * Enables or disables the offset & delete settings
         * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
         */
        disableControls: function(enabled) {
            state.offsetX.disabled = enabled;
            state.offsetY.disabled = enabled;
            state.delete.disabled = enabled;
        },

        /**
         * Shows controls for a cell in the table
         * @param {object} currentObject - The target image element in the table
         */
        show_controls: function(currentObject) {
            graphicHandler.setSelectedItem(currentObject);

            // Disable controls if the image src is not found
            if (currentObject.getAttribute("src") == null) {
                this.disableControls(true);
            } else {
                this.disableControls(false);
            }

            // Get row / cell number
            var rownumb = currentObject.parentNode.dataset.x;
            var cellnumb = currentObject.parentNode.dataset.y;

            // Function variable for event
            const setnumb = function () {
                cellCollection[rownumb][cellnumb].xOffset = state.offsetX.value;
                cellCollection[rownumb][cellnumb].yOffset = state.offsetY.value;

                graphicHandler.redraw()
            }

            // Unbind all events
            if (currentObject != previousObject) {
                $(state.offsetX).unbind();
                $(state.offsetY).unbind();
            }

            // Check if object has been accessed before
            if (previousObject != null) { previousObject.style.border = "1px solid gray" };

            // Make the previous object the current one
            previousObject = currentObject;

            // Apply green border
            currentObject.style.border = "green solid 3px";

            // Get offset
            if (previousObject != null) {
                // Get stored values
                Xoffset = cellCollection[rownumb][cellnumb].xOffset;
                Yoffset = cellCollection[rownumb][cellnumb].yOffset;

                // Set values
                state.offsetX.value = Xoffset;
                state.offsetY.value = Yoffset;

                // Add event listeners
                $(state.offsetX).change(setnumb);
                $(state.offsetY).change(setnumb);
            }
        }
    }
}()