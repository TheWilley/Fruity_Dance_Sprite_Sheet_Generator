var filecount = 0;
var selectedItem;
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
        document.getElementById("lock-on")
    ]

    if (xvalue.disabled == true) {
        elements.forEach(e => {
            if(e.id == "lock-on") {
                e.style.display = "none"
            } else if (e.id == "lock-off") {
                e.style.display = "block";
            } else {
                e.disabled = false;
            }
        })

    } else {
        elements.forEach(e => {
            if(e.id == "lock-on") {
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

    console.log(image);

    let ctx = document.getElementById('canvas');
    if (ctx.getContext) {
        ctx = ctx.getContext('2d');
        // Drawing of image
        GeneratedCanvas.onload = function() {
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

        // Check if the whole canvas is being cleared
        if (clear) { ctx.clearRect(0, 0, canvas.width, canvas.height) };

        // Check if a part of the canvas is being cleared
        if (image == "") { ctx.clearRect(cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), parseInt(document.getElementById("cell_width").value), parseInt(document.getElementById("cell_height").value)) }

        // Bool restore
        setClear(false);

        // Drawing of image
        GeneratedCanvas.onload = function() {
            let cell_width = parseInt(document.getElementById("cell_width").value);
            let cell_height = parseInt(document.getElementById("cell_height").value);

            // Create clipping path
            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
        };
    }
}

function setClear(e) {
    clear = e;
}

// Download Canvas & Text File
const download = document.getElementById('download');
download.addEventListener('click', function(e) {
    const link = document.createElement('a');
    link.download = 'FruityDanceGen.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;

    saveTextAsFile(textarea.value, 'FruityDanceGen.txt');
});

// Get multiple files
window.onload = function() {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {
            var files = event.target.files;
            var output = document.getElementById("result");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image'))
                    continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function(event) {
                    var picFile = event.target;

                    var div = document.createElement("div");
                    div.setAttribute("class", "result-container");

                    div.innerHTML = "<img class='thumbnail draggable' src='" + picFile.result + "'" +
                        "title='" + picFile.name + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";
                    output.insertBefore(div, null);
                    sessionStorage.imagenumb = Number(sessionStorage.imagenumb) + 1;
                });
                //Read the image
                picReader.readAsDataURL(file);
            }
        });
    } else {
        console.log("Your browser does not support File API");
    }
}

function remove() {
    currentObject = selectedItem;
    // Get row / cell number
    var rownumb = currentObject.parentNode.dataset.x;
    var cellnumb = currentObject.parentNode.dataset.y;

    // Step 1, remove from array
    cellCollection[rownumb][cellnumb] = new Object();

    // Step 2, remove from grid
    currentObject.src = "";

    // Step 3, remove from canvas
    preview_image_edit("", rownumb, cellnumb), 0, 0;
}