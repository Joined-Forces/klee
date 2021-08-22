import { Canvas2D } from "../../canvas";
import { Constants } from "../../constants";
import { Color } from "../../data/color";
import { CommentNode } from "../../data/nodes/comment.node";
import { Vector2 } from "../../math/vector2";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";

export class CommentNodeControl extends NodeControl implements DrawableControl {

    private static readonly _HEADER_TEXT_COLOR = "rgb(238,238,238)";
    private static readonly _DEFAULT_COMMENT_COLOR = "rgba(255,255,255,1)";

    private headerBackgroundColor: string;
    private bodyBackgroundColor: string;

    constructor(node: CommentNode) {
        super(node);

        this.zIndex = -100;
        this.width = node.width;
        this.height = node.height;

        this.applyCommentColor(node.color);
    }

    applyCommentColor(nodeColor: string) {
        if (nodeColor == undefined || nodeColor == '') 
            nodeColor = CommentNodeControl._DEFAULT_COMMENT_COLOR;

        let color = new Color(nodeColor);
        
        color.applyGamma();
        color.A = color.A * 0.3;
        this.bodyBackgroundColor = color.toRGBAString();
        color.darken(0.3);
        this.headerBackgroundColor = color.toRGBString();
    }

    draw(canvas: Canvas2D) {

        canvas.save();

        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(this.bodyBackgroundColor)
            .font(Constants.NODE_FONT)
            .roundedRectangle(0, 0, this.width, this.height, 5)
            .fill()

        this.drawTitle(canvas);

        canvas.roundedRectangle(0, 0, this.width, this.height, 5);

        this.drawStroke(canvas);

        canvas.restore();
    }

    drawTitle(canvas: Canvas2D) {

        const textPosition = new Vector2(9, 23);
        const headerHeight = 32;

        canvas.fillStyle(this.headerBackgroundColor)
            .roundedRectangle(0, 0, this.width, headerHeight, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .font("600 18px sans-serif")
            .textAlign('left')
            .strokeStyle('#333')
            .lineWidth(1.5)
            .strokeText((this.node as CommentNode).comment, textPosition.x + 1, textPosition.y + 1)
            .fillStyle(CommentNodeControl._HEADER_TEXT_COLOR)
            .fillText((this.node as CommentNode).comment, textPosition.x, textPosition.y)
    }
}
