function downloadZIP(canvas, text, filename) {
    var zip = new JSZip();
    var zipFilename = `${filename}.zip`;
    var output = new Image();
    output.src = canvas.toDataURL();

    // Check for invalid characters in filename
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(filename) == true || filename == "") {
        alert("Illegal file name!")
    } else {
        // Zip image and text file
        zip.file(`${filename}.png`, output.src.substring(output.src.indexOf(',') + 1), { base64: true });
        zip.file(`${filename}.txt`, text)

        // Save file
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
        });
    }
}

// Download Canvas & Text File
domObjects.getId("download").addEventListener('click', function (e) {
    downloadZIP(canvas, document.getElementById("textarea").value, document.getElementById("filename").value);
});

// Get multiple files
window.onload = function () {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        // THe input element
        var filesInput = document.getElementById("files");

        // An event listener, checks when button is clicked and file is submited
        filesInput.addEventListener("change", function (event) {
            // Get files and output element
            var files = event.target.files;
            files = [...files].filter(s => s.type.includes("image"))
            var output = document.getElementById("result");

            // Go trough all files
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only pics and files under 1mb (1.000.000 bytes)
                if (!file.type.match('image') || parseInt(file.size) > 1000000) {
                    // To stop spaming
                    if (files.length <= 1) {
                        alert("File too big or not an image")
                    }
                    continue;
                }

                // Check if file has been loaded
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    var picFile = event.target;

                    // Create div for image
                    var div = document.createElement("div");
                    div.setAttribute("class", "result-container");

                    // Insert the image
                    div.innerHTML = "<img class='thumbnail draggable' src='" + picFile.result + "'" +
                        "title='" + picFile.name + "' id='imagenumb" + sessionStorage.imagenumb + "'/>";

                    // Insert the combined div and image
                    output.insertBefore(div, null);

                    // Keep track of the number of files
                    sessionStorage.imagenumb = Number(sessionStorage.imagenumb) + 1;

                    // Add div to local storage
                    localStorage.setItem("images", document.getElementById("result").innerHTML);
                    localStorage.setItem("imagenumb", sessionStorage.imagenumb)
                });
                //Read the image
                picReader.readAsDataURL(file);
            }
        });
    } else {
        alert("Your browser does not support File API");
    }
}

function clearData() {
    if (!confirm('This action will remove ALL UPLOADED IMAGES. Continue?')) {
        return;
    }

    // Reset local storage
    localStorage.setItem("images", "")
    localStorage.setItem("imagenumb", "")

    location.reload();
}