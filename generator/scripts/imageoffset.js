var imageOffset = function () {
    var previousObject = null

    return {
        disableControls: function(enabled) {
            state.offsetX.disabled = enabled;
            state.offsetY.disabled = enabled;
            state.delete.disabled = enabled;
        },

        show_controls: (currentObject) => {
            graphicHandler.setSelectedItem(currentObject);

            if (currentObject.getAttribute("src") == null || currentObject.getAttribute("src") == "data:,") {
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

                graphicHandler.setClear(true);
                console.log(graphicHandler.getClear())

                graphicHandler.redraw()
            }

            // Unbind all events
            if (currentObject != previousObject) {
                $(state.offsetX).unbind();
                $(state.offsetY).unbind();
            }

            // First check if object has been accessed before
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