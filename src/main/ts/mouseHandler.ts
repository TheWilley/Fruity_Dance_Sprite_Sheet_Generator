import {globals} from "./setup";
import $ from "jquery";

class MouseHandler {
	private _mousePosX = 0;
	private _mousePosY = 0;
	private _delay = 6;
	private _revisedMousePosX = 0;
	private _revisedMousePosY = 0;
	private _state = globals.config.state;

	constructor() {
		this.createEventListener();
		this.delayMouseFollow();
	}

	createEventListener() {
		/**
		 * Detects when mouse is moving
		 */
		$(document).on("mousemove", (moveEvent) => {
			this._mousePosX = moveEvent.pageX;
			this._mousePosY = moveEvent.pageY;
		});
	}

	/**
	 * Delays circle movement
	 */
	delayMouseFollow() {
		requestAnimationFrame(this.delayMouseFollow.bind(this));

		this._revisedMousePosX +=
			(this._mousePosX - this._revisedMousePosX) / this._delay;
		this._revisedMousePosY +=
			(this._mousePosY - this._revisedMousePosY) / this._delay;

		this._state.mouseCircle.style.top = `${this._revisedMousePosY}px`;
		this._state.mouseCircle.style.left = `${this._revisedMousePosX}px`;
	}
}

export default MouseHandler;
