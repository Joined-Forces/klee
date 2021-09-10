import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";
import { Application } from "../../application";


export class HeadlessNodeControl extends NodeControl {

    private static readonly _NODE_BACKGROUND_COLOR = "rgba(15,15,15,0.6)";
    private static readonly _NODE_PIN_ICONS_WIDTH = 140;

    constructor(node: Node) {
        super(node);

        

        this.minHeight = 32;
        this.minWidth = Math.max(130, (!isNaN(this.minWidth)) ? this.minWidth : 0);
        this.padding = { top: 2, right: 0, bottom: 0, left: 0 };

        this.createPins(new Vector2(0, 0));
    }

    override initialize() {
        if(this.node.title) {
            this.minWidth = this.app.canvas
                .font(Constants.NODE_MATHFUNC_TITLE_FONT)
                .getContext().measureText(this.node.title).width + HeadlessNodeControl._NODE_PIN_ICONS_WIDTH;
        }
    }

    public onDraw(canvas: Canvas2D) {
        canvas.fillStyle(HeadlessNodeControl._NODE_BACKGROUND_COLOR)
            .roundedRectangle(0, 0, this.size.x, this.size.y, 16) // -(this.height * .3)
            .fill()

        this.drawTitle(canvas);
        this.drawFirstSubTitle(canvas);
        this.drawStroke(canvas);
    }

    protected drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font(Constants.NODE_MATHFUNC_TITLE_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.title, this.size.x * 0.5, this.size.y * 0.5 + 8);
    }


    protected drawFirstSubTitle(canvas: Canvas2D) {
        if(!this.node.subTitles || this.node.subTitles.length === 0) { return; }

        canvas
            .font(Constants.NODE_MATHFUNC_SUBTITLE_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.subTitles[0].text, this.size.x * 0.5, this.size.y * 0.5 + 22);
    }
}
