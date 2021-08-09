import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";


export class HeadlessNodeControl extends NodeControl implements DrawableControl {

    private static readonly _NODE_BACKGROUND_COLOR = "rgba(15,15,15,0.6)";

    constructor(node: Node) {
        super(node);

        this.createPins(new Vector2(0, 0));
    }

    draw(canvas: Canvas2D) {
        canvas.save();
        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(HeadlessNodeControl._NODE_BACKGROUND_COLOR)
            .roundedRectangle(0, 0, this.width, this.height, 16) // -(this.height * .3)
            .fill()

        this.drawStroke(canvas);
        this.drawPins(canvas);

        canvas.restore();
    }
}
