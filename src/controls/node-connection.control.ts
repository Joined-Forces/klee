import { Canvas2D } from "../canvas";
import { PinCategory } from "../data/pin/pin-category";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin.control";
import { ColorUtils } from "./utils/color-utils";

export class NodeConnectionControl extends Control implements DrawableControl {

    private _pinStart: PinControl;
    private _pinEnd: PinControl;

    private _pinStartPosition: Vector2;
    private _pinEndPosition: Vector2;

    private _curveValue: number;
    private _color: string;
    private _lineWidth: number;

    constructor(pinStart: PinControl, pinEnd: PinControl) {
        super(pinStart.position.x, pinStart.position.y, -1);

        this._pinStart = pinStart;
        this._pinEnd = pinEnd;

        this._pinStartPosition = this._pinStart.getAbsolutPosition();
        this._pinEndPosition = this._pinEnd.getAbsolutPosition();
        let difference = this._pinEndPosition.subtract(this._pinStartPosition);

        let distance = Math.sqrt((difference.x * difference.x) + (difference.y * difference.y)) - 12;
        this._curveValue = distance * 0.4;
        this._color = ColorUtils.getPinColor(this._pinStart.pinProperty);

        this._lineWidth = (this._pinStart.pinProperty.category === PinCategory.exec) ? 2.5 : 1.5;
    }

    draw(canvas: Canvas2D): void {
        canvas.lineWidth(this._lineWidth)
        .beginPath()
        .moveTo(this._pinStartPosition.x - 6, this._pinStartPosition.y)
        .strokeStyle(this._color)
        .lineTo(this._pinStartPosition.x + 12, this._pinStartPosition.y)
        .bezierCurveTo(
            this._pinStartPosition.x + this._curveValue + 6,
            this._pinStartPosition.y,
            this._pinEndPosition.x - this._curveValue - 6,
            this._pinEndPosition.y,
            this._pinEndPosition.x - 12,
            this._pinEndPosition.y
        )
        .lineTo(this._pinEndPosition.x - 6, this._pinEndPosition.y)
        .stroke();
    }
}
