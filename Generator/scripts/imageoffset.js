var img_wrapper = document.querySelector('#img_wrapper'),
    img_container = document.querySelector('#img_container'),
    img_element = document.querySelector('#img_element'),
    x = 0,
    y = 0,
    previousObject = null,
    mousedown = false;

function show_controls(currentObject) {
    selectedItem = currentObject;
    // Get input for X and Y
    let xoffsetform = document.getElementById("offsetX");
    let yoffsetform = document.getElementById("offsetY");

    console.log(currentObject.getAttribute("src")) 
    if(currentObject.getAttribute("src") == null) {
        xoffsetform.disabled = true;
        yoffsetform.disabled = true;
    } else {
        xoffsetform.disabled = false;
        yoffsetform.disabled = false;
    }

    // Get row / cell number
    var rownumb = currentObject.parentNode.dataset.x;
    var cellnumb = currentObject.parentNode.dataset.y;

    // Function variable for event
    const setnumb = function () {
        cellCollection[rownumb][cellnumb].xOffset = xoffsetform.value;
        cellCollection[rownumb][cellnumb].yOffset = yoffsetform.value;

        setClear(true);

        cellCollection.forEach(row => {
            row.forEach(cell => {
                if(cell.imageSrc != undefined) {
                    preview_image_edit(cell.imageSrc, cell.x, cell.y, cell.xOffset, cell.yOffset)
                }
            });
        })
    }

    // Unbind all events
    if (currentObject != previousObject) { $(xoffsetform).unbind(); $(yoffsetform).unbind(); }

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