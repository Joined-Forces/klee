import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";
import { Application } from "../../application";


export class HeadlessNodeControl extends NodeControl implements DrawableControl {

    private static readonly _NODE_BACKGROUND_COLOR = "rgba(15,15,15,0.6)";
    private static readonly _NODE_PIN_ICONS_WIDTH = 110;

    constructor(node: Node) {
        super(node);

        if(this.node.title) {
            this.width = Application.canvas.getContext().measureText(this.node.title).width + HeadlessNodeControl._NODE_PIN_ICONS_WIDTH;
        }

        this.createPins(new Vector2(0, 0));
    }

    public draw(canvas: Canvas2D) {
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

    protected drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font(Constants.NODE_MATHFUNC_TITLE_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.title, this.width/2, this.height/2 + 8);
    }
}
