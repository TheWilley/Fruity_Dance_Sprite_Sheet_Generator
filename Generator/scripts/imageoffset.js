var img_wrapper = document.querySelector('#img_wrapper'),
    img_container = document.querySelector('#img_container'),
    img_element = document.querySelector('#img_element'),
    x = 0,
    y = 0,
    previousObject = null,
    mousedown = false;

function disableElementSpecificControls(enabled) {
    let xoffsetform = document.getElementById("offsetX");
    let yoffsetform = document.getElementById("offsetY");
    let remove = document.getElementById("delete");

    xoffsetform.disabled = enabled;
    yoffsetform.disabled = enabled;
    remove.disabled = enabled;
}

function show_controls(currentObject) {
    selectedItem = currentObject;
    // Get input for X and Y
    let xoffsetform = document.getElementById("offsetX");
    let yoffsetform = document.getElementById("offsetY");

    if (currentObject.getAttribute("src") == null || currentObject.getAttribute("src") == "data:,") {
        disableElementSpecificControls(true);
    } else {
        disableElementSpecificControls(false);
    }

    // Get row / cell number
    var rownumb = currentObject.parentNode.dataset.x;
    var cellnumb = currentObject.parentNode.dataset.y;

    // Function variable for event
    const setnumb = function() {
        cellCollection[rownumb][cellnumb].xOffset = xoffsetform.value;
        cellCollection[rownumb][cellnumb].yOffset = yoffsetform.value;

        setClear(true);

        cellCollection.forEach(row => {
            row.forEach(cell => {
                if (cell.imageSrc != undefined) {
                    preview_image_edit(cell.imageSrc, cell.x, cell.y, cell.xOffset, cell.yOffset)
                }
            });
        })
    }

    // Unbind all events
    if (currentObject != previousObject) { $(xoffsetform).unbind();
        $(yoffsetform).unbind(); }

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

$(function() {
    $("body").click(function(e) {
        // Check if click is inside the grid
        if (!e.target.classList.contains('immg-grid') && !e.target.classList.contains('offsetControlls') ) {
            // Disable all offsets
            disableElementSpecificControls(true)

            // Remove border
            if (selectedItem != undefined) { selectedItem.style.border = "none" };
        }
    });
})