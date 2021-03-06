import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Node } from "../../data/nodes/node";
import { PinProperty } from "../../data/pin/pin-property";
import { PinControl } from "../pin.control";
import { PinDirection } from "../../data/pin/pin-direction";
import { ColorUtils } from "../utils/color-utils";


export class RerouteNodeControl extends NodeControl implements DrawableControl {

    private color: string;

    constructor(node: Node) {
        super(node);
        this.width = 16;
        this.height = 16;

        this._stroke.lineWidth = 0.5;
        this.drawChildren = false;
        this.color = ColorUtils.getPinColor(node.customProperties[0] as PinProperty);

        this.mainPanel.width = 0;

        this.createPins();
    }


    protected override onPinCreated(pin: PinControl) {
        pin.ignoreLayout = true;
        this.mainPanel.add(pin);
        pin.position.y = 8;
        pin.width = 20;
        pin.height = 0;
        pin.visible = false;
    }

    onDraw(canvas: Canvas2D) {
        canvas.translate(8, 8)
            .fillStyle(this.color)
            .fillCircle(6, 0, 2.3)
            .fillCircle(0, 0, 6)

        this.drawStroke(canvas);
    }
}
