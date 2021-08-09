import { Canvas2D } from "./canvas";
import { Vector2 } from "./math/vector2";

export class Camera {

    private _canvas: Canvas2D;
    private _position: Vector2;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._position = new Vector2(0, 0);
    }

    public get position(): Vector2 {
        return this._position;
    }

    prepareViewport() {
        this._canvas.translate(this._position.x, this._position.y);
    }

    moveRelative(value: Vector2) {
        this._position = this._position.add(value);
    }

    centreAbsolutePosition(value: Vector2) {
        this._position = new Vector2(
            value.x + this._canvas.width / 2,
            value.y + this._canvas.height / 2);

        this.prepareViewport();
    }
}
