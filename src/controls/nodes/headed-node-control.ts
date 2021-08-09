import { Canvas2D } from "../../canvas";
import { Node } from "../../data/nodes/node";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { ColorUtils } from "../utils/color-utils";
import { Application } from "../../application";
import { Vector2 } from "../../math/vector2";
import { Constants } from "../../constants";


export class HeadedNodeControl extends NodeControl implements DrawableControl {

    private static readonly _NODE_HEADER_HEIGHT = 24;
    private static readonly _NODE_HEADER_ICONS_WIDTH = 92;

    private _fillStyleHeader: CanvasGradient;

    constructor(node: Node) {
        super(node);

        this.width = Application.canvas.getContext().measureText(this.node.title).width + HeadedNodeControl._NODE_HEADER_ICONS_WIDTH;
        this._fillStyleHeader = this.getHeaderFillStyle();

        this.createPins(new Vector2(0, HeadedNodeControl._NODE_HEADER_HEIGHT));
    }

    draw(canvas: Canvas2D) {

        canvas.save();

        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(Constants.NODE_BACKGROUND_COLOR)
            .font(Constants.NODE_FONT)
            .roundedRectangle(0, 0, this.width, this.height, 5)
            .fill()

        this.drawTitle(canvas);

        canvas.roundedRectangle(0, 0, this.width, this.height, 5);

        this.drawStroke(canvas);
        this.drawPins(canvas);

        canvas.restore();
    }

    private drawTitle(canvas: Canvas2D) {
        canvas.fillStyle(this._fillStyleHeader)
            .roundedRectangle(0, 0, this.width, HeadedNodeControl._NODE_HEADER_HEIGHT, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .font(Constants.NODE_HEADER_FONT)
            .textAlign('left')
            .fillStyle(Constants.NODE_TEXT_COLOR)
            .fillText(this.node.title, 30, 18);
    }

    private getHeaderFillStyle(): CanvasGradient {
        const headerColor = ColorUtils.getNodeColorForClass(this.node.class);
        const gradient = Application.canvas.getContext().createLinearGradient(0, 0, 150, 0);
        gradient.addColorStop(0, `rgb(${headerColor})`);
        gradient.addColorStop(1, `rgba(${headerColor},0.15)`);
        return gradient;
    }
}
