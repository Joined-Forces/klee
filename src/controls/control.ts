import { Vector2 } from "../math/vector2";

export abstract class Control {

    private _position: Vector2;
    protected width: number;
    protected height: number;
    private _zIndex: number;

    constructor(x: number, y: number, zIndex?: number) {
        this.position = new Vector2(x, y);
        this._zIndex = zIndex || 0;
    }

    get position() {
        return this._position;
    }

    set position(value: Vector2) {
        this._position = value;
    }

    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    get zIndex() {
        return this._zIndex;
    }

    set zIndex(value: number) {
        this._zIndex = value;
    }
}