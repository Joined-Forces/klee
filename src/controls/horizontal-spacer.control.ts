import { Canvas2D } from "../canvas";
import { UserControl } from "./user-control";

export class HorizontalSpacerControl extends UserControl {

    constructor(width: number) {
        super();

        this.fillParentVertical = true;
        this.minWidth = width;
        this.padding = { top: 0, right: 0, bottom: 0, left: 0 }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0e0")
        .strokeRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
    }
}
