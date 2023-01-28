import { config } from "../../app";

class MouseHandler {
    private _mousePosX = 0;
    private _mousePosY = 0;
    private _delay = 6;
    private _revisedMousePosX = 0;
    private _revisedMousePosY = 0;
    private _state = config.state

    constructor() {
        this.createEventListener()
        this.delayMouseFollow();
    }

    createEventListener() {
        const self = this

        /**
         * Detects when mouse is moving
         */
        $(document).on("mousemove", function (moveEvent) {
            self._mousePosX = moveEvent.pageX;
            self._mousePosY = moveEvent.pageY;
        });
    }

    /**
     * Delays circle movement
     */
    delayMouseFollow() {
        requestAnimationFrame(this.delayMouseFollow);

        this._revisedMousePosX += (this._mousePosX - this._revisedMousePosX) / this._delay;
        this._revisedMousePosY += (this._mousePosY - this._revisedMousePosY) / this._delay;

        this._state.mouseCircle.style.top = `${this._revisedMousePosY}px`;
        this._state.mouseCircle.style.left = `${this._revisedMousePosX}px`;
    }
}

export default MouseHandler