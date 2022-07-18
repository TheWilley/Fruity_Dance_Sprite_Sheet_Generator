/*/ 
Author: c4software
Link: https://gist.github.com/c4software/981661f1f826ad34c2a5dc11070add0f
/*/

function downloadZIP(canvas, text) {
    console.log(text);
    var zip = new JSZip();
    var zipFilename = "zipFilename.zip";
    var output = new Image();
    output.src = canvas.toDataURL();

    // Zip image and text file
    zip.file("fruityDanceGen.png", output.src.substring(output.src.indexOf(',')+1), {base64: true});
    zip.file("fruityDanceGen.txt", text)

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, zipFilename);
    });
}