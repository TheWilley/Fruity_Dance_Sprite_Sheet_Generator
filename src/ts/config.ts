/*/ Loading global objects here /*/
var state = new ElementCatcher({ targetElement: document.getElementById("app"), getElementsWith: "id" });

interface IConfig {
            /*/ Canvas settings /*/
            maxRows: number, // Max amount of allowed rows

            minWidth: number, // Minimum cell width
            minHeight: number, // Minimum cell height
            minXOffset: number, // Minimum X-offset
            minYOffset: number, // Minimum Y-offset
    
            maxWidth: number, // Maximum cell width
            maxHeight: number, // Maximum cell height
            maxXOffset: number, // Maximum X-offset
            maxYOffset: number, // Maximum Y-offset
            
            /*/ Upload settings /*/
            maxUploadSize: string, // Max image upload size
            imageQuality: number, // The image quality (1 = best quality, 0 = worst quality)
            imageSizeMultiplier: number, // Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality.
            maxAllowedGifFrames: number, // Limit how many frames of a gif to export
    
            /*/ Other settings /*/
            previewFPS: number, // The FPS of a preview
            amountOfCollections: number, // The amount of collections 
            background: string, // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
            warnBeforeLeavingPage: boolean // Warn user before leaving page to not discard any progress
}

/**
 * Configuration function
 */
var config = function () {
    var settings: IConfig = {
        /*/ Canvas settings /*/
        maxRows: 40, // Max amount of allowed rows

        minWidth: 80, // Minimum cell width
        minHeight: 80, // Minimum cell height
        minXOffset: -20, // Minimum X-offset
        minYOffset: -150, // Minimum Y-offset

        maxWidth: 150, // Maximum cell width
        maxHeight: 150, // Maximum cell height
        maxXOffset: 150, // Maximum X-offset
        maxYOffset: 150, // Maximum Y-offset
        
        /*/ Upload settings /*/
        maxUploadSize: "8mb", // Max image upload size
        imageQuality: 0.7, // The image quality (1 = best quality, 0 = worst quality)
        imageSizeMultiplier: 1, // Multiplies the max proportions of an uploaded image (by default the minWidth/minHeight and maxWidth/maxHeight values). Higher value here means better image quality.
        maxAllowedGifFrames: 30, // Limit how many frames of a gif to export

        /*/ Other settings /*/
        previewFPS: 4, // The FPS of a preview
        amountOfCollections: 12, // The amount of collections 
        background: null, // A custom background, must be a link to an image / path to a local one OR a color in HEX (null will mean default)
        warnBeforeLeavingPage: true // Warn user before leaving page to not discard any progress
    }

    new Map([
        ["maxRows", (value: number | boolean | string) => { state.rows.setAttribute("max", value) }],
        ["minWidth", (value) => { state.cell_width.setAttribute("min", value); state.cell_width.value = value }],
        ["maxWidth", (value) => { state.cell_width.setAttribute("max", value) }],
        ["minHeight", (value) => { state.cell_height.setAttribute("min", value); state.cell_height.value = value }],
        ["maxHeight", (value) => { state.cell_height.setAttribute("max", value) }],
        ["minXOffset", (value) => { state.offsetX.setAttribute("min", value) }],
        ["maxXOffset", (value) => { state.offsetX.setAttribute("max", value) }],
        ["minYOffset", (value) => { state.offsetY.setAttribute("min", value) }],
        ["maxYOffset", (value) => { state.offsetY.setAttribute("max", value) }],
        ["background", (value) => { let root = document.documentElement; if(value != null) String(value)[0] == "#" ? root.style.setProperty("--background", String(value)) : root.style.setProperty("--background", `url(${value})`) }],
    ]).forEach((value, key) => {
        if (settings[key as keyof IConfig]) value(settings[key as keyof IConfig])
    })

    return {
        settings
    }
}()