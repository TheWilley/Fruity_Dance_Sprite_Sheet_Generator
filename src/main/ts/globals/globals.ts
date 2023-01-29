import Configuration from "./config"
import ElementCatcher from "./elementCatcher"
import ImageCollection from "./imageCollection"

class Globals {
    private _elementCatcher: ElementCatcher
    private _config: Configuration
    private _imageCollection: ImageCollection

    get elementCatcher() {
        return this._elementCatcher
    }

    get config() {
        return this._config
    }

    get imageCollection() {
        return this._imageCollection
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
}

export default Globals