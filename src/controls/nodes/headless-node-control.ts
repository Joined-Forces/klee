import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";


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

        this.drawTitle(canvas);

        this.drawStroke(canvas);
        this.drawPins(canvas);

        canvas.restore();
    }

    private drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font(Constants.NODE_HEADER_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_TEXT_COLOR)
            .fillText(this.node.title, this.width/2, 16);
    }
}
