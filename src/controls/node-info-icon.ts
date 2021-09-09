import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { Icon } from "./icon";
import { UserControl } from "./user-control";

export class NodeInfoIcon extends Icon {

    private static readonly ICON_SIZE: number = 22;
    private static readonly HALF_ICON_SIZE: number = 11;

    constructor(icon: string) {
        super(icon);

        this.ignoreLayout = true;

        this.width = NodeInfoIcon.ICON_SIZE;
        this.height = NodeInfoIcon.ICON_SIZE;
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#00e");
        canvas.strokeRect(this.parent.size.x, -NodeInfoIcon.HALF_ICON_SIZE, this.parent.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
        canvas.fillStyle(Constants.NODE_TEXT_COLOR)
            .translate(this.parent.size.x + this.padding.left - NodeInfoIcon.HALF_ICON_SIZE, -NodeInfoIcon.HALF_ICON_SIZE + this.padding.top)
            .fill(this.icon, 'evenodd');
    }

}