function refresh() {
    // Get table id and refresh
    let dyntable = document.getElementById("dyntable");
    console.log(dyntable)
    if (dyntable != null) {
        for (let row of dyntable.rows) {
            console.log(row.dataset.row)
            if (row.dataset.row > parseInt(document.getElementById("xvalue").value))
                dyntable.deleteRow(row.dataset.row)
        }
    }

    // Get form id and refresh
    let target_form = document.getElementById("form");
    if (target_form != null) {
        target_form.remove();
    }

    // Reset text element
    document.getElementById("textarea").value = "";
}

function addTable() {
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

    // Loop trough and add rows
    for (let i = 0; i < xvalue; i++) {


        // Generate tanle rows
        let table_row = document.createElement('TR');
        table_row.setAttribute("data-row", i);
        dyntable.appendChild(table_row);

        /* For every row, add another row to the 2D array in @getSet.js.
        This way, the array is dynamic. */
        cellCollection.push([]);

        for (let j = 0; j <= 7; j++) {
            // Generate table cells
            let table_cell = document.createElement('TD');
            table_cell.setAttribute("data-column", j);
            table_cell.classList.add('dropzone')

            // Generate image cells
            let image_cell = document.createElement('IMG');
            let image_controls = document.createElement('SPAN');

            // Set all image_cell attributes
            image_cell.setAttribute("data-image", j);
            image_cell.setAttribute("class", "immg-grid");
            image_cell.onclick = function() { show_controls(j) };

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

    // Generate text in textarea
    for (l = 1; l < xvalue; l++) {
        textarea.value += "Animation " + l + "\n";
    }
    textarea.value += "Held";

    // Refresh tables
    refresh();
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

function show_controls(id) {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.getElementById(id).querySelector("#image_controls").appendChild(clon);

    for (let i = 0; i < cellCollection.length; i++) {
        let innerArrayLength = cellCollection[i].length;

        for (let j = 0; j < innerArrayLength; i++) {
            console.log(cellCollection[i][j].imageID, id);
            if (cellCollection[i][j].imageID == id) {
                document.getElementById("Xoffset").value = cellCollection[i][j].imageGridOffset[0];
                document.getElementById("Yoffset").value = cellCollection[i][j].imageGridOffset[1];

                currentCell = cellCollection[i][j];

                break;
            }
        }
    }
}