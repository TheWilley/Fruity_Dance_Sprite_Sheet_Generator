var config = function () {
    var settings = {
        maxRows: 13,
        minWidth: 20,
        maxWidth: 99,
        minHeight: 20,
        maxHeight: 30,
    }

    new Map([
        ["maxRows", function (value) { state.rows.setAttribute("max", value) }],
        ["minWidth", function (value) { state.cell_width.setAttribute("min", value); state.cell_width.value = value }],
        ["maxWidth", function (value) { state.cell_width.setAttribute("max", value) }],
        ["minHeight", function (value) { state.cell_height.setAttribute("min", value); state.cell_height.value = value }],
        ["maxHeight", function (value) { state.cell_height.setAttribute("max", value) }],
    ]).forEach((value, key) => {
        console.log(key)
        if (settings[key]) value(settings[key])
    })
}()