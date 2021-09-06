import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { UserControl } from "./user-control";

export class Label extends UserControl {

    public font: string;
    public textAlign: CanvasTextAlign;
    public color: string;
    public text: string;
    public baseLine: number;

    constructor(text: string, font?: string, color?: string) {
        super();

        this.text = text;
        this.font = (font || Constants.NODE_FONT);
        this.color = (color || Constants.NODE_TEXT_COLOR);

        let textMetrics = this.measureText();
        this.width = textMetrics.width;
        this.height = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
        this.baseLine = Math.floor(this.height / 3);

        this.padding = { top: 0, right: 0, bottom: 0, left: 0 }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0e0")
        .strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.font(this.font)
            .textAlign(this.textAlign)
            .fillStyle(this.color)
            .fillText(this.text, this.padding.left, this.height + this.padding.top - this.baseLine);
    }

    private measureText(text?: string): TextMetrics {
        return Application.canvas.font(this.font).getContext().measureText((text || this.text));
    }

}