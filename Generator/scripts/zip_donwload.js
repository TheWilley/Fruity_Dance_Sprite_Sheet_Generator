/*/ 
Author: c4software
Link: https://gist.github.com/c4software/981661f1f826ad34c2a5dc11070add0f
/*/

// We need to parse blobs, not urls!
var urls = [];

function downloadZIP() {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "zipFilename.zip";

    urls.forEach(function(url) {
        var filename = "filename";
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function(err, data) {
            if (err) {
                throw err; // or handle the error
            }
            zip.file(filename, data, { binary: true });
            count++;
            if (count == urls.length) {
                zip.generateAsync({ type: 'blob' }).then(function(content) {
                    saveAs(content, zipFilename);
                });
            }
        });
    });
}