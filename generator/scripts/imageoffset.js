var imageOffset = function () {
    var previousObject = null

    function disableElementSpecificControls(enabled) {
        let xoffsetform = document.getElementById("offsetX");
        let yoffsetform = document.getElementById("offsetY");
        let remove = document.getElementById("delete");

        xoffsetform.disabled = enabled;
        yoffsetform.disabled = enabled;
        remove.disabled = enabled;
    }

    return {
        show_controls: (currentObject) => {
            graphicHandler.get().selectedItem = currentObject;
            // Get input for X and Y
            let xoffsetform = document.getElementById("offsetX");
            let yoffsetform = document.getElementById("offsetY");

            if (currentObject.getAttribute("src") == null || currentObject.getAttribute("src") == "data:,") {
                disableElementSpecificControls(true);
            } else {
                disableElementSpecificControls(false);
            }

            // Get row / cell number
            var rownumb = currentObject.parentNode.dataset.x;
            var cellnumb = currentObject.parentNode.dataset.y;

            // Function variable for event
            const setnumb = function () {
                cellCollection[rownumb][cellnumb].xOffset = xoffsetform.value;
                cellCollection[rownumb][cellnumb].yOffset = yoffsetform.value;

                graphicHandler.get().clear = true;

                graphicHandler.redraw()
            }

            // Unbind all events
            if (currentObject != previousObject) {
                $(xoffsetform).unbind();
                $(yoffsetform).unbind();
            }

            // First check if object has been accessed before
            if (previousObject != null) { previousObject.style.border = "none" };

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
                xoffsetform.value = Xoffset;
                yoffsetform.value = Yoffset;

                // Add event listeners
                $(xoffsetform).change(setnumb);
                $(yoffsetform).change(setnumb);
            }
        }
    }
}