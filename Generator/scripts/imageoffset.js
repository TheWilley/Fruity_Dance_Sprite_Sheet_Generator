var img_wrapper = document.querySelector('#img_wrapper'), 
img_container = document.querySelector('#img_container'), 
img_element = document.querySelector('#img_element'), 
x = 0, 
y = 0, 
mousedown = false; 

function show_controls(currentObject) {
    img_wrapper.style.width = document.getElementById("cell_width").value + "px";
    img_wrapper.style.height = document.getElementById("cell_height").value + "px";
    img_element.style.width = document.getElementById("cell_width").value + "px";
    img_element.style.height = document.getElementById("cell_height").value + "px";    

    document.getElementById("img_element").src = currentObject.src;

    img_container.style.left = 0;
    img_container.style.top = 0;

    let Xoffset = 0;
    let Yoffset = 0;

    var rownumb = currentObject.parentNode.dataset.x;
    var cellnumb = currentObject.parentNode.dataset.y;

    if (currentObject.src != "") {
        img_container.style.left = cellCollection[rownumb][cellnumb].xOffset;
        img_container.style.top = cellCollection[rownumb][cellnumb].yOffset;
    } 
    addEventListeners(currentObject, rownumb, cellnumb, Xoffset, Yoffset);
}

function addEventListeners(currentObject, rownumb, cellnumb, Xoffset, Yoffset) {
    img_container.addEventListener('mousedown', function(e) {
        e.preventDefault();
        mousedown = true;
        x = img_container.offsetLeft - e.clientX;
        y = img_container.offsetTop - e.clientY;
    }, true);

    img_container.addEventListener('mouseup', function(e) {
        mousedown = false;
    }, true);

    img_container.addEventListener('mousemove', function(e) {
        if (mousedown) {
            img_container.style.left = e.clientX + x + 'px';
            img_container.style.top = e.clientY + y + 'px';

            cellCollection[rownumb][cellnumb].xOffset = e.clientX + x;
            cellCollection[rownumb][cellnumb].yOffset = e.clientY + y;
            Xoffset = e.clientX + x;
            Yoffset = e.clientY + y;
            preview_image_edit(currentObject.src, rownumb, cellnumb, Xoffset, Yoffset);
        }
    }, true);

    
    img_container.addEventListener('dblclick', function(e) {
        img_container.style.left = 0;
        img_container.style.top = 0;

        cellCollection[rownumb][cellnumb].xOffset = 0;
        cellCollection[rownumb][cellnumb].yOffset = 0;
        preview_image_edit(currentObject.src, rownumb, cellnumb, Xoffset, Yoffset);
    }, true);
}