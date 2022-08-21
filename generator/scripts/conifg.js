var config = function () {
    var settings = {
        maxRows: 40, // Max amount of allowed rows
        minWidth: 80, // Minimum width
        maxWidth: 150, // Maximum width
        minHeight: 80, // Minimum height
        maxHeight: 150, // Maximum height
        maxUploadSize: "2mb" // Max image upload size
    }

    new Map([
        ["maxRows", (value) => { state.rows.setAttribute("max", value) }],
        ["minWidth", (value) => { state.cell_width.setAttribute("min", value); state.cell_width.value = value }],
        ["maxWidth", (value) => { state.cell_width.setAttribute("max", value) }],
        ["minHeight", (value) => { state.cell_height.setAttribute("min", value); state.cell_height.value = value }],
        ["maxHeight", (value) => { state.cell_height.setAttribute("max", value) }],
        ["maxHeight", (value) => { state.cell_height.setAttribute("max", value) }],
    ]).forEach((value, key) => {
        if (settings[key]) value(settings[key])
    })

    return {
        settings
    }
}()
