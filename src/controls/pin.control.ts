import { Canvas2D } from "../canvas";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { ColorUtils } from "./utils/color-utils";


export class PinControl extends Control implements DrawableControl {

    private _parentPosition: Vector2;
    private _pinProperty: PinProperty;

    private _isInput: boolean;
    private _color: string;

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._parentPosition = parentPosition;
        this._pinProperty = pin;

        this._isInput = this._pinProperty.direction !== PinDirection.EGPD_Output;
        this._color = ColorUtils.getPinColor(this._pinProperty);
    }

    get pinProperty(): PinProperty {
        return this._pinProperty;
    }

    draw(canvas: Canvas2D): void {

        let pinCategory = this.pinProperty.category;
        canvas.fillStyle(this._color).strokeStyle(this._color);

        switch (pinCategory) {
            case PinCategory.exec:
                this.drawExecutionPin(canvas);
                break;
            case PinCategory.delegate:
                this.drawDelegatePin(canvas);
                break;
            default:
                this.drawPin(canvas);
        }
    }

    private drawPin(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);

        canvas.fillText(this._pinProperty.formattedName, textX, this.position.y + 4)
        .fillStyle(this._color)
        .fillCircle(this.position.x + 6, this.position.y, 2.3);

        if (this._pinProperty.isLinked) {
            canvas.fillCircle(this.position.x, this.position.y, 6)
        } else {
            canvas.strokeStyle(this._color)
            .lineWidth(2)
            .strokeCircle(this.position.x, this.position.y, 4.8)
        }

        canvas.strokeStyle("#000")
        .lineWidth(.5)
        .strokeCircle(this.position.x, this.position.y, 6);
    }

    private drawExecutionPin(canvas: Canvas2D) {
        canvas.save()
        .translate(this.position.x, this.position.y - 7);

        canvas.strokeStyle('#fff')
        .fillStyle('#fff')
        .lineWidth(1.1)
        .beginPath()
        .moveTo(-5, 0)
        .lineTo(-1, 0)
        .lineTo(6, 6)
        .lineTo(6, 8)
        .lineTo(-1, 14)
        .lineTo(-5, 14)
        .lineTo(-6, 13)
        .lineTo(-6, 1)
        .lineTo(-5, 0)
        .closePath();

        if (this.pinProperty.isLinked)
            canvas.fill();
        else
            canvas.stroke();

        canvas.restore();
    }

    private drawDelegatePin(canvas: Canvas2D) {
        canvas.save()
        .translate(this.position.x - 5, this.position.y - 5);

        canvas.strokeStyle("#FF3838")
        .lineWidth(2)
        .roundedRectangle(0, 0, 10, 10, 3);

        if (this.pinProperty.isLinked)
            canvas.fill();
        else
            canvas.stroke();

        canvas.restore();
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        let textX = this.position.x - 12;

        if (this._isInput) {
            canvas.textAlign("left")
            textX = this.position.x + 12;
        }
        else
            canvas.textAlign("right")

        canvas.font('12px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    getAbsolutPosition(): Vector2 {
        return new Vector2(
            this._parentPosition.x + this.position.x,
            this._parentPosition.y + this.position.y
        );
    }
}
