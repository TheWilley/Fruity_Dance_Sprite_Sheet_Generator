var filecount = 0;

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
            var files = event.target.files; //FileList object
            var output = document.getElementById("result");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image'))
                    continue;
                var picReader = new FileReader();
                var imagenumb = 0;
                picReader.addEventListener("load", function(event) {
                    var picFile = event.target;
                    var div = document.createElement("div");
                    div.setAttribute("class", "result-container");
                    div.innerHTML = "<img class='thumbnail draggable' src='" + picFile.result + "'" +
                        "title='" + picFile.name + "' id='imagenumb" + imagenumb + "'/>";
                    output.insertBefore(div, null);
                    imagenumb++;
                });
                //Read the image
                picReader.readAsDataURL(file);
            }
        });
    } else {
        console.log("Your browser does not support File API");
    }
}