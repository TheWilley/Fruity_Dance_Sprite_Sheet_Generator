/**
 *  Class used to store info about images
 */
class ImageInfo {
	private _x;
	private _y;
	private _xOffset;
	private _yOffset;
	private _sizeMultiplier;
	private _isFlippedVertically;
	private _isFlippedHorizontally;
	private _imageSrc;

	constructor(
		x: number,
		y: number,
		xOffset?: number,
		yOffset?: number,
		sizeMultiplier?: number,
		isFlippedVertically?: boolean,
		isFlippedHorizontally?: boolean,
		imageSrc?: string
	) {
		this._x = x;
		this._y = y;
		this._xOffset = xOffset;
		this._yOffset = yOffset;
		this._sizeMultiplier = sizeMultiplier;
		this._isFlippedVertically = isFlippedVertically;
		this._isFlippedHorizontally = isFlippedHorizontally;
		this._imageSrc = imageSrc;
	}

	get x() {
		return this._x;
	}

	set x(value: number) {
		this._x = value;
	}

	get y() {
		return this._y;
	}

	set y(value: number) {
		this._y = value;
	}

	get xOffset() {
		return this._xOffset;
	}

	set xOffset(value: number) {
		this._xOffset = value;
	}

	get sizeMultiplier() {
		return this._sizeMultiplier;
	}

	set sizeMultiplier(value: number) {
		this._sizeMultiplier = value;
	}

	get yOffset() {
		return this._yOffset;
	}

	set yOffset(value: number) {
		this._yOffset = value;
	}

	get isFlippedHorizontally() {
		return this._isFlippedHorizontally;
	}

	set isFlippedHorizontally(value: boolean) {
		this._isFlippedHorizontally = value;
	}

	get isFlippedVertically() {
		return this._isFlippedVertically;
	}

	set isFlippedVertically(value: boolean) {
		this._isFlippedVertically = value;
	}

	get imageSrc() {
		return this._imageSrc;
	}

	set imageSrc(value: string) {
		this._imageSrc = value;
	}
}

export default ImageInfo;
