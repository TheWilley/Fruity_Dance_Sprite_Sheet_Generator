import { globals } from "./setup";

/**
 * Generates the preview canvas element
 *
 * FPS control by codetheory.in, archived by elundmark
 * https://gist.github.com/elundmark/38d3596a883521cb24f5
 */
class Preview {
	private _row: number;
	private _fps: number;
	private _pause: boolean;
	private _then: number;
	private _interval: number;
	private _frame: number;
	private _now: number;
	private _delta: number;
	private _bind: any;
	private _width: number;
	private _height: number;
	private _x: number;
	private _previewCanvas: HTMLCanvasElement;
	private _state = globals.config.state;

	constructor(row: number, fps: number, cell: HTMLElement) {
		this._row = row;
		this._fps = fps;

		// Default values
		this._pause = false;
		this._then = Date.now();
		this._interval = 1000 / this._fps;
		this._frame = 0;
		this._now;
		this._delta;
		this._bind; // The bind is used by the requestAnimationFrame to avoid binding many times
		this._width = this._state.cell_width.value;
		this._height = this._state.cell_height.value;

		// Set the height and width
		const canvas = document.createElement("canvas");
		canvas.classList.add("gif_previews");

		// Generate canvas
		this._previewCanvas = canvas;
		this._previewCanvas.width = this._width;
		this._previewCanvas.height = this._height;
		cell.appendChild(canvas);

		// Image position
		this._x = 0;
	}

	nextFrame() {
		// Generate settings
		const originalCanvas = this._state.canvas,
			startClippingY = this._height * this._row - this._height,
			clippingWidth = this._width,
			clippingHeight = this._height,
			pasteX = 0,
			pasteY = 0,
			pasteWidth = this._width,
			pasteHeight = this._height;

		// Changing variable
		let startClippingX = 0;

		// Update the x variable
		startClippingX = this._x;

		// Get the previewCanvas
		const context = this._previewCanvas.getContext("2d");

		// Clear the canvas
		context.clearRect(pasteX, pasteY, pasteWidth, pasteHeight);

		// Draw the image
		context.drawImage(
			originalCanvas,
			startClippingX,
			startClippingY,
			clippingWidth,
			clippingHeight,
			pasteX,
			pasteY,
			pasteWidth,
			pasteHeight
		);

		// First stroke the text
		context.fillStyle = "rgba(0, 0, 0, 0.8)";
		context.fillRect(0, 0, 12, 16);
		context.fillStyle = "white";
		context.font = "15px serif";
		context.lineWidth = 2;
		context.fillText(String(this._frame), 0, pasteY + 12);

		// Go to next frame
		this._frame++;

		// Add to the x
		this._x += Number(this._width);
	}

	start() {
		if (this._bind == undefined) {
			this._bind = this.start.bind(this);
		}

		if (this._pause == true) {
			return;
		}

		// Call for animation
		window.requestAnimationFrame(this._bind);

		this._now = Date.now();
		this._delta = this._now - this._then;

		if (this._delta > this._interval) {
			this._then = this._now - (this._delta % this._interval);
			this.nextFrame();
		}
		if (this._x > this._width * 7) {
			this._x = 0;
			this._frame = 0;
		}
	}

	pause() {
		this._pause = true;
	}

	restart() {
		this._pause = false;
		this.start();
	}

	get getPauseState() {
		return this._pause;
	}
}

export default Preview;
