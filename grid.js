function addTable() {
    // Get table id and refresh
    var maintable = document.getElementById("maintable");
    if (maintable != null) {
        maintable.remove();
    }

    // Get form id and refresh
    var target_form = document.getElementById("form");
    console.log(target_form);
    if (target_form != null) {
        target_form.remove();
    }

    // Get target DIV
    var targsdiv = document.getElementById("dyntable");
    // Create table and assign ID
    var newtable = document.createElement('TABLE');
    newtable.id = "maintable";
    newtable.ClassName = "table table-bordered";

    // Get values
    var xvalue = parseInt(document.getElementById("xvalue").value);
    var cell_width = parseInt(document.getElementById("cell_width").value);
    var cell_height = parseInt(document.getElementById("cell_height").value);

    // Create head
    var theadrow = document.createElement('TR');
    for (var j = 1; j <= 8; j++) {

        var thead = document.createElement('TD');
        thead.width = cell_width;
        thead.height = 20;

        thead.appendChild(document.createTextNode("Frame" + j));
        newtable.appendChild(theadrow);
        theadrow.appendChild(thead);
    }

    // Loop trough and add rows
    for (var i = 0; i < xvalue; i++) {
        var tr = document.createElement('TR');
        tr.id = "row" + i;
        newtable.appendChild(tr);
        for (var i2 = 0; i2 <= 7; i2++) {
            var td = document.createElement('TD');
            td.width = cell_width;
            td.height = cell_height;
            var remotebutton = document.createElement('input');
            remotebutton.type = "button";
            remotebutton.value = "Browse...";
            remotebutton.id = i + "-" + i2;
            remotebutton.addEventListener("click", function() {
                // Get current id for button
                var id = this.id;
                // Save them
                var buttonid1 = parseInt(id.charAt(0));
                var buttonid2 = parseInt(id.charAt(2));

                // Generate the link
                generatelink(buttonid1, buttonid2);
                // Click, then remove to allow new input
                document.getElementById("inputset").click();
                document.getElementById("inputset").remove();
                document.getElementById(id).ClassName = "DONE";
            });
            td.appendChild(remotebutton);

            var imagecell = document.createElement('IMG');
            td.appendChild(imagecell);
            tr.appendChild(td);
        }
        rowlink = document.createElement('TD');

        // Dynamic link generation for buttons
        function generatelink(buttonid1, buttonid2) {
            rowlink.innerHTML = '<input id="inputset" type="file" accept="image/*" onchange="preview_image(event,' + buttonid1 + "," + buttonid2 + ')">';
        }
        rowlink.id = "rowlink" + i;
        rowlink.className = "rows";
        tr.appendChild(rowlink);
    }
    targsdiv.appendChild(newtable);

    // Canvas Creation
    var ContainerCanvas = document.getElementById("ContainerCanvas");
    var canvas = document.getElementById("canvas");

    var CanvasElement = document.createElement('canvas');
    if (canvas != null) {
        canvas.remove();
    }
    CanvasElement.height = cell_height * xvalue;
    CanvasElement.width = cell_width * 8;
    CanvasElement.id = "canvas";
    ContainerCanvas.appendChild(CanvasElement);

    // Reset text element
    document.getElementById("textarea").value = "";
    // Generate text in textarea
    for (l = 0; l < xvalue; l++) {
        document.getElementById("textarea").value += "Animation " + l + "\n";
    }
    document.getElementById("textarea").value += "Held";
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}