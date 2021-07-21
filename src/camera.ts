import { Canvas2D } from "./canvas";
import { Vector2 } from "./math/vector2";

export class Camera {

    canvas: Canvas2D;
    position: Vector2;

    constructor(canvas: Canvas2D) {
        this.canvas = canvas;
        this.position = new Vector2(0, 0);
    }

    prepareViewport() {
        this.canvas.translate(this.position.x, this.position.y);
    }

    moveRelative(value: Vector2) {
        this.position = this.position.add(value);
    }
}