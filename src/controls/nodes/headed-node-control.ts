import { Canvas2D } from "../../canvas";
import { Node } from "../../data/nodes/node";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { ColorUtils } from "../utils/color-utils";
import { Application } from "../../application";
import { Vector2 } from "../../math/vector2";
import { Constants } from "../../constants";
import { IconLibrary } from "../utils/icon-library";


export class HeadedNodeControl extends NodeControl implements DrawableControl {

    private static readonly _NODE_HEADER_PADDING_TOP = 15;
    private static readonly _NODE_HEADER_TITLE_HEIGHT = 23;
    private static readonly _NODE_HEADER_SUBTITLE_HEIGHT = 14;
    private static readonly _NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE = 4;
    private static readonly _NODE_HEADER_PADDING_LEFT = 29;
    private static readonly _NODE_HEADER_ICONS_WIDTH = 92;

    private _fillStyleHeader: CanvasGradient;
    private _headerHeight = HeadedNodeControl._NODE_HEADER_TITLE_HEIGHT;
    private _icon: Path2D = undefined;

    constructor(node: Node) {
        super(node);

        let largestTitleWidth = Application.canvas.getContext().measureText(this.node.title).width;
        if (this.node.subTitles && this.node.subTitles.length > 0) {
            for (const subTitle of this.node.subTitles) {
                largestTitleWidth = Math.max(largestTitleWidth, Application.canvas.getContext().measureText(subTitle.text).width);
            }
            this._headerHeight += (HeadedNodeControl._NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE - 2) + (HeadedNodeControl._NODE_HEADER_SUBTITLE_HEIGHT * node.subTitles.length);
        }

        this.width = largestTitleWidth + HeadedNodeControl._NODE_HEADER_ICONS_WIDTH;

        this.createPins(new Vector2(0, this._headerHeight));

        this._fillStyleHeader = this.getHeaderFillStyle();

        let icon = IconLibrary.getIconForNode(node);
        if (icon) {
            this._icon = new Path2D(icon);
        }
    }

    public draw(canvas: Canvas2D) {

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

        if (this._icon) {
            canvas.save();

            canvas.fillStyle("#fff")
            .strokeStyle("rgba(0,0,0,0.4)")
            .lineWidth(1.5)
            .translate(8, 4)
            .stroke(this._icon)
            .fill(this._icon);

            canvas.restore();
        }

        if (this.node.subTitles && this.node.subTitles.length > 0) {
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
        const gradient = Application.canvas.getContext().createLinearGradient(0, 0, 150, 0);
        gradient.addColorStop(0, `rgb(${this.node.backgroundColor})`);
        gradient.addColorStop(1, `rgba(${this.node.backgroundColor},0.15)`);
        return gradient;
    }
}
