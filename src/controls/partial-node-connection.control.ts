import { Canvas2D } from "../canvas";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin.control";
import { ColorUtils } from "./utils/color-utils";

export class NodePartialConnectionControl extends Control implements DrawableControl {

    private static readonly LINE_LENGTH = 80;

    private _pin: PinControl;
    private _isDirectionOutput: boolean;
    
    private _color: string;
    private _lineWidth: number;

    constructor(pin: PinControl) {
        super(pin.getAbsolutPosition().x, pin.getAbsolutPosition().y, -1);

        this._pin = pin;

        this._color = ColorUtils.getPinColor(this._pin.pinProperty);
        this._isDirectionOutput = this._pin.pinProperty.direction == PinDirection.EGPD_Output;
        this._lineWidth = (this._pin.pinProperty.category === PinCategory.exec) ? 2.5 : 1.5;
    }

    draw(canvas: Canvas2D): void {
        canvas.save();
        canvas.translate(this._pin.getAbsolutPosition().x, this._pin.getAbsolutPosition().y);

        canvas.lineWidth(this._lineWidth)
        .beginPath()
        .setLineDash([30, 4, 2.5, 4, 2.5, 4, 2.5]);

        if (this._isDirectionOutput) {
            canvas.moveTo(6, 0)
            .lineTo(NodePartialConnectionControl.LINE_LENGTH, 0);
        } else {
            canvas.moveTo(-6, 0)
            .lineTo(-NodePartialConnectionControl.LINE_LENGTH, 0);
        }

        canvas.strokeStyle(this._color)
        .stroke();

        canvas.restore();
    }
}
