import { Canvas2D } from "../canvas";
import { NodeObject } from "../data/node-object";
import { DrawableControl } from "./interfaces/drawable";
import { NodeControlBase } from "./node-control-base";

export class RerouteNodeView extends NodeControlBase implements DrawableControl {

    fillStyle: string;

    constructor(node: NodeObject) {
        super(node);
        this.width = 12;
        this.height = 12;

        this.fillStyle = "rgb(255, 255, 255)";

        this.headerHeight = 0;
        this._stroke.lineWidth = 0.5;

        this.createPins();
    }

    initialize() {
        super.initialize();
    }

    draw(canvas: Canvas2D) {
        canvas.fillStyle("rgb(255, 255, 255)")
            .fillCircle(this.position.x + 6, this.position.y, 2.3)
            .fillCircle(this.position.x, this.position.y, 6)

        this.drawStroke(canvas);
    }
}