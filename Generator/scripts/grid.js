function addTable() { 
    // Add all elements from last time
    document.getElementById("result").innerHTML = localStorage.getItem("images")
    sessionStorage.imagenumb = localStorage.getItem("imagenumb");
    
    // Check if there is any image added and warn user
    var allCellsEmpty = true;

    cellCollection.forEach(e1 => {
        e1.forEach(e2 => {
            if (!e2.imageSrc == "") {
                allCellsEmpty = false;
            }
        })
    })

    if (!allCellsEmpty) {
        if (!confirm('This action will clear the canvas! Continue?')) {
            return;
        }
    }
    
    // Get elements value
    var xvalue = parseInt(document.getElementById("xvalue").value);
    var cell_width = parseInt(document.getElementById("cell_width").value);
    var cell_height = parseInt(document.getElementById("cell_height").value);

    // Get elements node
    var textarea = document.getElementById("textarea");
    var ContainerCanvas = document.getElementById("ContainerCanvas");
    var canvas = document.getElementById("canvas");

    // Create table and assign ID
    var dyntable = document.getElementById("dyntable");

    cellCollection = [];
    dyntable.innerHTML = '<thead><td width="80" height="20">Frame1</td><td width="80" height="20">Frame2</td><td width="80" height="20">Frame3</td><td width="80" height="20">Frame4</td><td width="80" height="20">Frame5</td><td width="80" height="20">Frame6</td><td width="80" height="20">Frame7</td><td width="80" height="20">Frame8</td></thead>';

    // Loop trough and add rows
    for (let x = 0; x < xvalue; x++) {
        /* For every row, add another row to the 2D array in @getSet.js.
        This way, the array is dynamic. */
        cellCollection.push([]);

        // Create preview
        let prev = new preview(x + 1, 4);

        for (let y = 0; y <= 7; y++) {
            // Here we add a tempobject to the grid to store for later usage
            let tempobject = new ImageObject(x, y);
            cellCollection[x][y] = tempobject;
        }
    }

    for (let i = 0; i < cellCollection.length; i++) {
        // Generate tanle rows
        let table_row = document.createElement('TR');
        dyntable.appendChild(table_row);

        // Get the size of the inner array
        var innerArrayLength = cellCollection[i].length;
        // Loop the inner array
        for (let j = 0; j < innerArrayLength; j++) {
            // Generate table cells
            let table_cell = document.createElement('TD');
            table_cell.setAttribute("data-x", i);
            table_cell.setAttribute("data-y", j);
            table_cell.classList.add('dropzone')

            // Generate image cells
            let image_cell = document.createElement('IMG');
            let image_controls = document.createElement('SPAN');

            // Set all image_cell attributes
            image_cell.setAttribute("class", "immg-grid");
            image_cell.onclick = function() { show_controls(this) };

            // Set all image_controlls attributes
            image_controls.setAttribute("id", "image_controls")

            // Append all elemments
            table_cell.appendChild(image_cell);
            table_cell.appendChild(image_controls);
            table_row.appendChild(table_cell);
        }
    }

    // Canvas Creation
    let canvas_element = document.createElement('canvas');
    if (canvas != null) {
        canvas.remove();
    }

    canvas_element.setAttribute("height", cell_height * xvalue);
    canvas_element.setAttribute("width", cell_width * 8);
    canvas_element.setAttribute("id", "canvas");
    ContainerCanvas.appendChild(canvas_element);

    // Reset text element
    document.getElementById("textarea").value = "";

    // Generate text in textarea
    for (l = 1; l < xvalue; l++) {
        textarea.value += "Animation " + l + "\n";
    }
    textarea.value += "Held";
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    // Create all varaibles
    let textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    let downloadLink = document.createElement("a");

    // Set attributes
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    // Browser Dependent
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