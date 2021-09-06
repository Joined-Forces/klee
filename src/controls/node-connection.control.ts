import { Canvas2D } from "../canvas";
import { PinCategory } from "../data/pin/pin-category";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin.control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";

export class NodeConnectionControl extends UserControl {

    private pinStart: PinControl;
    private pinEnd: PinControl;

    private pinStartPosition: Vector2;
    private pinEndPosition: Vector2;

    private curveValue: number;
    private color: string;
    private lineWidth: number;

    constructor(pinStart: PinControl, pinEnd: PinControl) {
        super(0, 0, -1);

        this.pinStart = pinStart;
        this.pinEnd = pinEnd;

        this.pinStartPosition = this.pinStart.getPinAbsolutePosition();
        this.pinEndPosition = this.pinEnd.getPinAbsolutePosition();
        let difference = this.pinEndPosition.subtract(this.pinStartPosition);

        let distance = Math.sqrt((difference.x * difference.x) + (difference.y * difference.y)) - 12;
        this.curveValue = distance * 0.4;
        this.color = ColorUtils.getPinColor(this.pinStart.pinProperty);

        this.lineWidth = (this.pinStart.pinProperty.category === PinCategory.exec) ? 2.5 : 1.5;
    }

    onDraw(canvas: Canvas2D): void {
        this.pinStartPosition = this.pinStart.getPinAbsolutePosition();
        this.pinEndPosition = this.pinEnd.getPinAbsolutePosition();
        let difference = this.pinEndPosition.subtract(this.pinStartPosition);
        let distance = Math.sqrt((difference.x * difference.x) + (difference.y * difference.y)) - 12;
        this.curveValue = distance * 0.4;

        canvas.lineWidth(this.lineWidth)
        .beginPath()
        .moveTo(this.pinStartPosition.x, this.pinStartPosition.y)
        .strokeStyle(this.color)
        .lineTo(this.pinStartPosition.x + 6, this.pinStartPosition.y)
        .bezierCurveTo(
            this.pinStartPosition.x + this.curveValue + 6,
            this.pinStartPosition.y,
            this.pinEndPosition.x - this.curveValue - 6,
            this.pinEndPosition.y,
            this.pinEndPosition.x - 6,
            this.pinEndPosition.y
        )
        .lineTo(this.pinEndPosition.x, this.pinEndPosition.y)
        .stroke();
    }
}
