import { Canvas2D } from "../../canvas";
import { UserControl } from "../user-control";
import { Color } from "../../data/color";
import { Constants } from "../../constants";


export class ColorBoxControl extends UserControl {

    private color: Color;

    constructor(color: Color) {
        super();

        this.color = color;
        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.width = this.height;
    }

    protected onDraw(canvas: Canvas2D) {
        canvas
            .roundedRectangle(0, 0 - Constants.DEFAULT_BOX_HEIGHT / 2, this.width, this.height, Constants.DEFAULT_BOX_RADIUS)
            .fillStyle(this.color.toRGBAString())
            .fill()
    }
}
