import Configuration from "./config"
import ElementCatcher from "./elementCatcher"
import ImageCollection from "./imageCollection"
import GraphicHandler from "./graphicHandler"

class Globals {
    private _elementCatcher: ElementCatcher
    private _config: Configuration
    private _imageCollection: ImageCollection
    private _graphicHandler: GraphicHandler

    get elementCatcher() {
        return this._elementCatcher
    }

    get config() {
        return this._config
    }

    get imageCollection() {
        return this._imageCollection
    }

    get graphicHandler() {
        return this._graphicHandler
    }

    set elementCatcher(value: ElementCatcher) {
        this._elementCatcher = value
    }

    set config(value: Configuration) {
        this._config = value
    }

    set imageCollection(value: ImageCollection) {
        this._imageCollection = value
    }
    
    set graphicHandler(value: GraphicHandler) {
        this._graphicHandler = value
    }
}

export default Globals