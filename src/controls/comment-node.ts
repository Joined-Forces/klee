import { Canvas2D } from "../canvas";
import { NodeObject } from "../data/node-object";
import { CommentNodeObject } from "../data/node-objects/comment-node-object";
import { Vector2 } from "../math/vector2";
import { DrawableControl } from "./interfaces/drawable";
import { NodeControlBase } from "./node-control-base";

export class CommentNodeControl extends NodeControlBase implements DrawableControl {

    private _dataNode: CommentNodeObject;

    fillStyle: string;
    fillColorHeader: string;
    fillStyleHeader: CanvasGradient;
    fillStyleText: string;

    constructor(node: NodeObject) {
        super(node);

        this._dataNode = node as CommentNodeObject;
        this.zIndex = -100;


        this.width = this._dataNode.nodeWidth;
        this.height = this._dataNode.nodeHeight;

        this.headerHeight = 32;

        this.fillStyle = "rgba(255,255,255,0.22)";
        this.fillColorHeader = "rgba(160,160,160,1)";
        this.fillStyleText = "rgb(220,220,220)";
    }

    initialize() {
        let gradient = this.getContext().createLinearGradient(this.position.x, 0, this.position.x + 150, 0);
        gradient.addColorStop(0, this.fillColorHeader);
        this.fillStyleHeader = gradient;
    }

    draw(canvas: Canvas2D) {

        canvas.save();

        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(this.fillStyle)
            .font('12px sans-serif')
            .roundedRectangle(0, 0, this.width, this.height, 5)
            .fill()

        this.drawTitle(canvas);

        canvas.roundedRectangle(0, 0, this.width, this.height, 5);

        this.drawStroke(canvas);

        canvas.restore();
    }

    drawTitle(canvas: Canvas2D) {

        const textPosition = new Vector2(9, 23);

        canvas.fillStyle(this.fillStyleHeader)
            .roundedRectangle(0, 0, this.width, this.headerHeight, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
            .fill()
            .font("600 18px sans-serif")
            .textAlign('left')
            .strokeStyle('#333')
            .lineWidth(1.5)
            .strokeText(this.node.getName(), textPosition.x + 1, textPosition.y + 1)
            .fillStyle(this.fillStyleText)
            .fillText(this.node.getName(), textPosition.x, textPosition.y)
    }
}