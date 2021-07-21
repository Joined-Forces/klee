import { Blueprint } from "../blueprint";
import { Vector2 } from "../math/vector2";

export class Control {
    position: Vector2;
    
    _blueprint: Blueprint;
    zIndex: number;

    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.zIndex = 0;
    }

    initialize(): void { }

    get blueprint() {
        return this._blueprint;
    }

    set blueprint(value: Blueprint) {
        this._blueprint = value;
    }

    getContext(): CanvasRenderingContext2D {
        return this._blueprint.canvas.getContext();
    }
}