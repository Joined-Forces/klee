import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { UserControl } from "./user-control";


export class TextBoxControl extends UserControl {

    private text: string;

    constructor(text: string) {
        super();
        this.text = text;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.padding.top = 1;
        this.padding.bottom = 1;
    }

    override initialize() {
        this.width = this.app.canvas.getContext().measureText(this.text).width + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING * 2;
    }

    protected onDraw(canvas: Canvas2D) {
        canvas
            .roundedRectangle(0, 0 - Constants.DEFAULT_BOX_HEIGHT / 2, this.width, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle('rgba(70,70,70,0.5)')
            .fill()
            .font(Constants.NODE_FONT)
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(this.text, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING)
    }
}
