import { Canvas2D } from "../../canvas";
import { Node } from "../../data/nodes/node";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { ColorUtils } from "../utils/color-utils";
import { Application } from "../../application";
import { Vector2 } from "../../math/vector2";
import { Constants } from "../../constants";


export class HeadedNodeControl extends NodeControl implements DrawableControl {

    private static readonly _NODE_HEADER_TITLE_HEIGHT = 24;
    private static readonly _NODE_HEADER_SUBTITLE_HEIGHT = 14;
    private static readonly _NODE_HEADER_PADDING_TOP = 15;
    private static readonly _NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE = 5;
    private static readonly _NODE_HEADER_PADDING_LEFT = 29;
    private static readonly _NODE_HEADER_ICONS_WIDTH = 92;

    private _fillStyleHeader: CanvasGradient;
    private _headerHeight = HeadedNodeControl._NODE_HEADER_TITLE_HEIGHT;

    constructor(node: Node) {
        super(node);

        let largestTitleWidth = Application.canvas.getContext().measureText(this.node.title).width;
        if(this.node.subTitles) {
            for (const subTitle of this.node.subTitles) {
                largestTitleWidth = Math.max(largestTitleWidth, Application.canvas.getContext().measureText(subTitle.text).width);
            }
        }

        this.width = largestTitleWidth + HeadedNodeControl._NODE_HEADER_ICONS_WIDTH;
        this._fillStyleHeader = this.getHeaderFillStyle();

        if(this.node.subTitles) {
            this._headerHeight += (HeadedNodeControl._NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE - 2) + (HeadedNodeControl._NODE_HEADER_SUBTITLE_HEIGHT * node.subTitles.length);
        }

        this.createPins(new Vector2(0, this._headerHeight));
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
            .roundedRectangle(0, 0, this.width, this._headerHeight, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .font(Constants.NODE_HEADER_FONT)
            .textAlign('left')
            .fillStyle(Constants.NODE_TEXT_COLOR)
            .fillText(this.node.title, HeadedNodeControl._NODE_HEADER_PADDING_LEFT, HeadedNodeControl._NODE_HEADER_PADDING_TOP);


        if(this.node.subTitles) {
            let y = HeadedNodeControl._NODE_HEADER_PADDING_TOP + HeadedNodeControl._NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE;
            for (const subTitle of this.node.subTitles.sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0))) {
                y += HeadedNodeControl._NODE_HEADER_SUBTITLE_HEIGHT;
                canvas.font(Constants.NODE_FONT)
                    .fillStyle("rgb(165,135,100)")
                    .fillText(subTitle.text, HeadedNodeControl._NODE_HEADER_PADDING_LEFT, y);
            }
        }
    }

    private getHeaderFillStyle(): CanvasGradient {
        const headerColor = ColorUtils.getNodeColorForClass(this.node.class);
        const gradient = Application.canvas.getContext().createLinearGradient(0, 0, 150, 0);
        gradient.addColorStop(0, `rgb(${headerColor})`);
        gradient.addColorStop(1, `rgba(${headerColor},0.15)`);
        return gradient;
    }
}
