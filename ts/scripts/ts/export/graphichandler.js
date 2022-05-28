"use strict";
exports.__esModule = true;
exports.preview_image = void 0;
var filecount = 0;
sessionStorage.imagenumb = 0;
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        addTable();
    }
};
function LockParamters() {
    var xvalue = document.getElementById("xvalue");
    var cell_width = document.getElementById("cell_width");
    var cell_height = document.getElementById("cell_height");
    var unlocked = document.getElementById("lock-off");
    var locked = document.getElementById("lock-on");
    if (xvalue.disabled == true) {
        xvalue.disabled = false;
        cell_width.disabled = false;
        cell_height.disabled = false;
        locked.style.display = "none";
        unlocked.style.display = "block";
    }
    else {
        xvalue.disabled = true;
        cell_width.disabled = true;
        cell_height.disabled = true;
        locked.style.display = "block";
        unlocked.style.display = "none";
    }
}
function preview_image(image, rownumb, cellnumb) {
    // This is where we create the canvas and insert images
    var GeneratedCanvas = new Image();
    GeneratedCanvas.src = image;
    var ctx = document.getElementById('canvas');
    if (ctx.getContext) {
        ctx = ctx.getContext('2d');
        // Drawing of image
        GeneratedCanvas.onload = function () {
            var cell_width = parseInt(document.getElementById("cell_width").value);
            var cell_height = parseInt(document.getElementById("cell_height").value);
            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
        };
    }
    filecount++;
    //Start animation
    //startAnimation((Number(rownumb)));
}
exports.preview_image = preview_image;
function preview_image_edit(image, rownumb, cellnumb, Xoffset, Yoffset) {
    // This is where we create the canvas and insert images
    var GeneratedCanvas = new Image();
    GeneratedCanvas.src = image;
    var ctx = document.getElementById('canvas');
    if (ctx.getContext) {
        ctx = ctx.getContext('2d');
        // Drawing of image
        GeneratedCanvas.onload = function () {
            var cell_width = parseInt(document.getElementById("cell_width").value);
            var cell_height = parseInt(document.getElementById("cell_height").value);
            ctx.save();
            // Create clipping path
            var region = new Path2D();
            region.rect(cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
            ctx.clip(region, "evenodd");
            ctx.clearRect(cell_width * cellnumb, cell_height * rownumb, cell_width, cell_height);
            ctx.restore();
            ctx.drawImage(GeneratedCanvas, cell_width * cellnumb + Number(Xoffset), cell_height * rownumb + Number(Yoffset), cell_width, cell_height);
        };
    }
}
// Download Canvas & Text File
var download = document.getElementById('download');
download.addEventListener('click', function (e) {
    var link = document.createElement('a');
    link.download = 'FruityDanceGen.png';
    link.href = canvas.toDataURL();
    link.click();
    link["delete"];
    saveTextAsFile(textarea.value, 'FruityDanceGen.txt');
});
// Get multiple files
window.onload = function () {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");
        filesInput.addEventListener("change", function (event) {
            var files = event.target.files;
            var output = document.getElementById("result");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image'))
                    continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
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
    }
    else {
        console.log("Your browser does not support File API");
    }
};
