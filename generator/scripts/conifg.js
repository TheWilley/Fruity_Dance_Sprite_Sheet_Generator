var config = function () {
    var settings = {
        maxRows: 40, // Max amount of allowed rows

        minWidth: 80, // Minimum cell width
        minHeight: 80, // Minimum cell height
        minXOffset: -20, // Minimum X-offset
        minYOffset: -150, // Minimum Y-offset

        maxWidth: 150, // Maximum cell width
        maxHeight: 150, // Maximum cell height
        maxXOffset: 150, // Maximum X-offset
        maxYOffset: 150, // Maximum Y-offset
        
        maxUploadSize: "2mb" // Max image upload size
    }

    new Map([
        ["maxRows", (value) => { state.rows.setAttribute("max", value) }],
        ["minWidth", (value) => { state.cell_width.setAttribute("min", value); state.cell_width.value = value }],
        ["maxWidth", (value) => { state.cell_width.setAttribute("max", value) }],
        ["minHeight", (value) => { state.cell_height.setAttribute("min", value); state.cell_height.value = value }],
        ["maxHeight", (value) => { state.cell_height.setAttribute("max", value) }],
        ["minXOffset", (value) => { state.offsetX.setAttribute("min", value) }],
        ["maxXOffset", (value) => { state.offsetX.setAttribute("max", value) }],
        ["minYOffset", (value) => { state.offsetY.setAttribute("min", value) }],
        ["maxYOffset", (value) => { state.offsetY.setAttribute("max", value) }],
    ]).forEach((value, key) => {
        if (settings[key]) value(settings[key])
    })

    return {
        settings
    }
}()
