var filecount = 0,
    selectedItem,
    previewObjects = [];
sessionStorage.imagenumb = 0;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addTable();
    }
};

function LockParamters() {
    var elements = [
        document.getElementById("offsetX"),
        document.getElementById("offsetY"),
        document.getElementById("xvalue"),
        document.getElementById("cell_width"),
        document.getElementById("cell_height"),
        document.getElementById("lock-off"),
        document.getElementById("lock-on"),
    ]

    if (xvalue.disabled == true) {
        elements.forEach(e => {
            if (e.id == "lock-on") {
                e.style.display = "none"
            } else if (e.id == "lock-off") {
                e.style.display = "block";
            } else if ((e.id == "offsetX" || e.id == "offsetY") && selectedItem != null) {
                if (selectedItem.getAttribute('src') == null) {
                    e.disabled = true;
                } else {
                    e.disabled = false;
                }
            } else {
                e.disabled = false;
            }
        })

    } else {
        elements.forEach(e => {
            if (e.id == "lock-on") {
                e.style.display = "block"
            } else if (e.id == "lock-off") {
                e.style.display = "none";
            } else {
                e.disabled = true;
            }
        })
    }
}

function preview_image(image, rownumb, cellnumb) {
    // This is where we create the canvas and insert images
    let GeneratedCanvas = new Image();
    GeneratedCanvas.src = image;

    let ctx = document.getElementById('canvas');
    if (ctx.getContext) {
        ctx = ctx.getContext('2d');
        // Drawing of image
        GeneratedCanvas.onload = function () {
            let cell_width = parseInt(document.getElementById("cell_width").value);
            let cell_height = parseInt(document.getElementById("cell_height").value);

            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
        };
    }

    filecount++;

    //Start animation
    //startAnimation((Number(rownumb)));
}

var clear = false;

function preview_image_edit(image, rownumb, cellnumb, Xoffset, Yoffset) {
    // This is where we create the canvas and insert images
    let GeneratedCanvas = new Image();
    GeneratedCanvas.src = image;

    let canvas = document.getElementById('canvas');

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        // Get width and height
        let cell_width = parseInt(document.getElementById("cell_width").value);
        let cell_height = parseInt(document.getElementById("cell_height").value);

        // Check if the whole canvas is being cleared
        if (clear) { ctx.clearRect(0, 0, canvas.width, canvas.height) };

        // Check if a part of the canvas is being cleared
        if (image == "") { ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height) }

        // Bool restore
        setClear(false);

        // Drawing of image
        GeneratedCanvas.onload = function () {
            // Create clipping path
            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
        };
    }
}

function setClear(e) {
    clear = e;
}

function remove() {
    currentObject = selectedItem;
    // Get row / cell number
    var rownumb = currentObject.parentNode.dataset.x;
    var cellnumb = currentObject.parentNode.dataset.y;

    // Step 1, remove from canvas
    preview_image_edit("", rownumb, cellnumb, cellCollection[rownumb][cellnumb].xOffset, cellCollection[rownumb][cellnumb].yOffset);

    // Step 2, remove from array
    cellCollection[rownumb][cellnumb] = new ImageObject(rownumb, cellnumb);
    cellCollection[rownumb][cellnumb].xOffset = 0; // Needed to avoid an error regarding null offset
    cellCollection[rownumb][cellnumb].yOffset = 0; // Needed to avoid an error regarding null offset

    // Step 3, remove from grid
    currentObject.src = "data:,";
}

function configPreview(e) {
    if (e == true) {
        previewObjects.forEach(obj => {
            if (obj.getPauseState == true) {
                obj.restart()
            }
        })
    } else {
        previewObjects.forEach(obj => {
            obj.stop()
        })
    }
}

// Before leave
$(window).bind('beforeunload', function () {
    //return 'Your changes might not be saved';
})

window.addEventListener("scroll", (event) => {
    if(this.scrollY >= 45) {
        document.getElementsByClassName("sidebar")[0].classList.add("fixedSidebar")
        document.getElementsByClassName("sidebar-container")[0].classList.add("fixedContainer")
    } else {
        document.getElementsByClassName("sidebar")[0].classList.remove("fixedSidebar")
        document.getElementsByClassName("sidebar-container")[0].classList.remove("fixedContainer")
    }
});

