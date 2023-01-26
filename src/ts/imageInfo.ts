/**
 *  Class used to store info about images
 */
class ImageInfo {
    private _x
    private _y
    private _xOffset
    private _yOffset
    private _imageSrc

    constructor(x: number, y: number, xOffset?: number, yOffset?: number, imageSrc?: string) {
        this._x = x;
        this._y = y;
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._imageSrc = imageSrc;
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get xOffset() {
        return this._xOffset
    }

    get yOffset() {
        return this._yOffset
    }
}

export default ImageInfo