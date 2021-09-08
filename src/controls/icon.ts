import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { UserControl } from "./user-control";

export class Icon extends UserControl {

    private icon: Path2D;

    constructor(icon: string) {
        super();

        this.icon = new Path2D(icon);
        this.width = 22;
        this.height = 20;
        this.padding = { top: 3, right: 0, bottom: 0, left: 0 };
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#00e");
        canvas.strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.fillStyle(Constants.NODE_TEXT_COLOR)
            //.strokeStyle("rgba(0,0,0,0.4)")
            //.lineWidth(1)
            .translate(this.padding.left, this.padding.top)
            //.stroke(this.icon)
            .fill(this.icon, 'evenodd');
    }

}