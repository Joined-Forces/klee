import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Node } from "../../data/nodes/node";


export class RerouteNodeControl extends NodeControl implements DrawableControl {

    constructor(node: Node) {
        super(node);
        this.width = 12;
        this.height = 12;

        this._stroke.lineWidth = 0.5;

        this.createPins();
    }

    draw(canvas: Canvas2D) {
        canvas.fillStyle(`rgb(${this.node.backgroundColor})`)
            .fillCircle(this.position.x + 6, this.position.y, 2.3)
            .fillCircle(this.position.x, this.position.y, 6)

        this.drawStroke(canvas);
    }
}
