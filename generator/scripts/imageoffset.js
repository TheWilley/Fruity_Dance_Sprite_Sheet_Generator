var imageOffset = function () {
    var previousObject = null

    return {
        /**
         * Enables or disables the offset & delete settings
         * @param {boolean} enabled - True: Elements are disabled; False: Elements are enabled
         */
        disableControls: function(enabled) {
            state.offsetX.classList.add("disabled");
            state.offsetY.classList.add("disabled");
            state.delete.classList.add("disabled");
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
                imageInfo.getCellCollection()[rownumb][cellnumb].xOffset = state.offsetX.value;
                imageInfo.getCellCollection()[rownumb][cellnumb].yOffset = state.offsetY.value;

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
                Xoffset = imageInfo.getCellCollection()[rownumb][cellnumb].xOffset;
                Yoffset = imageInfo.getCellCollection()[rownumb][cellnumb].yOffset;

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