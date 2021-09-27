import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Container } from "./container";
import { Label } from "./label";
import { UserControl } from "./user-control";
import { VerticalPanel } from "./vertical-panel";


export class ErrorBar extends VerticalPanel {

    private color: string = "rgb(160, 0, 0)";
    private label: Label;
    private toolTip: string;

    constructor(text?: string, toolTip?: string) {
        super();
        
        this.fillParentHorizontal = true;

        this.minHeight = 15;

        this.label = new Label(text);
        this.label.fillParentHorizontal = true;
        this.label.textAlign = 'center';
        this.label.padding = { top: 2, right: 0, bottom: 0, left: 0 }
        this.add(this.label);

        this.toolTip = toolTip;
    }


    protected override onDraw(canvas: Canvas2D) {
        canvas.fillStyle(this.color)
        .roundedRectangle(0, 0, this.size.x, this.size.y, 3)
        .fill();
        
    }
}
