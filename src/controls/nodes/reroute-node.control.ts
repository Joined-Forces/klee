import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Node } from "../../data/nodes/node";
import { PinProperty } from "../../data/pin/pin-property";
import { PinControl } from "../pin.control";
import { PinDirection } from "../../data/pin/pin-direction";


export class RerouteNodeControl extends NodeControl implements DrawableControl {

    constructor(node: Node) {
        super(node);
        this.width = 12;
        this.height = 12;

        this._stroke.lineWidth = 0.5;
        this.drawChildren = false;

        this.createPins();
    }


    protected override onPinCreated(pin: PinControl) {
        pin.ignoreLayout = true;
        this.outputPinPanel.add(pin);
        pin.position.y = -14;

        if (pin.pinProperty.direction === PinDirection.EGPD_Input) {
            pin.position.x = 50;
        }
    }

    onDraw(canvas: Canvas2D) {
        canvas.fillStyle(`rgb(${this.node.backgroundColor})`)
            .fillCircle(6, 0, 2.3)
            .fillCircle(0, 0, 6)

        this.drawStroke(canvas);
    }
}
