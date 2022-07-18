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