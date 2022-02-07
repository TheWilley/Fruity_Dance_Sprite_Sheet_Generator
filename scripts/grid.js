function refresh() {
    // Get table id and refresh
    let maintable = document.getElementById("maintable");
    if (maintable != null) {
        maintable.remove();
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
    // Refresh tables
    refresh();

    // Get elements value
    var xvalue = parseInt(document.getElementById("xvalue").value);
    var cell_width = parseInt(document.getElementById("cell_width").value);
    var cell_height = parseInt(document.getElementById("cell_height").value);

    // Get elements node
    var textarea = document.getElementById("textarea");
    var target_div = document.getElementById("dyntable");
    var container_canvas = document.getElementById("ContainerCanvas");
    var canvas = document.getElementById("canvas");

    // Create table and assign ID
    var newtable = document.createElement('TABLE');
    newtable.setAttribute("id", "maintable");

    // Create head
    var thead_row = document.createElement('TR');

    // Generate 8 cells
    for (let i = 1; i <= 8; i++) {
        let thead = document.createElement('TD');
        thead.setAttribute("width", 80)
        thead.setAttribute("height", 20)

        // Append all elements
        newtable.appendChild(thead_row);
        thead_row.appendChild(thead);
        thead.appendChild(document.createTextNode("Frame" + i));
    }

    // Loop trough and add rows
    for (let i = 0; i < xvalue; i++) {
        // Generate tanle rows
        let table_row = document.createElement('TR');
        table_row.setAttribute("id", "row" + i);
        newtable.appendChild(table_row);

        for (let j = 0; j <= 7; j++) {
            // Generate table cells
            let table_cell = document.createElement('TD');
            table_cell.setAttribute("id", i + "-" + j);
            table_cell.classList.add('dropzone')

            // Generate image cells
            let image_cell = document.createElement('IMG');
            image_cell.setAttribute("id", "img" + i + "-" + j);
            image_cell.setAttribute("class", "immg-grid");
            table_cell.appendChild(image_cell);
            table_row.appendChild(table_cell);
        }
    }
    // 
    target_div.appendChild(newtable);

    // Canvas Creation
    let canvas_element = document.createElement('canvas');
    if (canvas != null) {
        canvas.remove();
    }

    canvas_element.setAttribute("height", cell_height * xvalue);
    canvas_element.setAttribute("width", cell_width * 8);
    canvas_element.setAttribute("id", "canvas");
    container_canvas.appendChild(canvas_element);

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