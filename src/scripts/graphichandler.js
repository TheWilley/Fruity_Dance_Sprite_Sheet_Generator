var filecount = 0;
sessionStorage.imagenumb = 0;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addTable();
    }
};

function LockParamters() {
    let xvalue = document.getElementById("xvalue");
    let cell_width = document.getElementById("cell_width");
    let cell_height = document.getElementById("cell_height");
    let unlocked = document.getElementById("lock-off");
    let locked = document.getElementById("lock-on");

    if (xvalue.disabled == true) {
        xvalue.disabled = false;
        cell_width.disabled = false;
        cell_height.disabled = false;
        locked.style.display = "none";
        unlocked.style.display = "block"

        notify("Locked!");
    } else {
        xvalue.disabled = true;
        cell_width.disabled = true;
        cell_height.disabled = true;
        locked.style.display = "block";
        unlocked.style.display = "none"
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
        GeneratedCanvas.onload = function() {
            let cell_width = parseInt(document.getElementById("cell_width").value);
            let cell_height = parseInt(document.getElementById("cell_height").value);

            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
        };
    }

    filecount++;
}

function preview_image_edit(image) {
    let rownumb, cellnumb;

    rownumb = currentObject.imageGridPosition[0];
    cellnumb = currentObject.imageGridPosition[1];

    let offsetx = parseInt(document.getElementById("Xoffset").value);
    let offsety = parseInt(document.getElementById("Yoffset").value);

    // This is where we create the canvas and insert images
    let GeneratedCanvas = new Image();
    GeneratedCanvas.src = image;

    let ctx = document.getElementById('canvas');
    if (ctx.getContext) {
        ctx = ctx.getContext('2d');
        // Drawing of image
        GeneratedCanvas.onload = function() {
            let cell_width = parseInt(document.getElementById("cell_width").value);
            let cell_height = parseInt(document.getElementById("cell_height").value);

            // Create clipping path
            let region = new Path2D();
            region.rect(cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
            ctx.clip(region, "evenodd");
            ctx.clearRect(cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);

            ctx.drawImage(GeneratedCanvas, (cell_width * cellnumb) + offsetx, (cell_height * rownumb) + offsety, cell_width, cell_height);
            currentObject.imageGridOffset = [offsetx, offsety];
        };
    }
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