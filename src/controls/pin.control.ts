import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { ColorUtils } from "./utils/color-utils";
import { DefaultValueBox } from "./utils/default-value-box";


export class PinControl extends Control implements DrawableControl {

    private static readonly _PIN_NAME_PADDING_LEFT = 12;

    private _parentPosition: Vector2;
    private _pinProperty: PinProperty;
    private _defaultValueBox: DefaultValueBox;

    private _isInput: boolean;
    private _color: string;
    private hidden: boolean;

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._parentPosition = parentPosition;
        this._pinProperty = pin;
        this.hidden = false;

        this._isInput = this._pinProperty.direction !== PinDirection.EGPD_Output;
        this._color = ColorUtils.getPinColor(this._pinProperty);
    }

    get pinProperty(): PinProperty {
        return this._pinProperty;
    }

    public postInit(): void {
        if (this.pinProperty.shouldDrawDefaultValueBox) {
            this._defaultValueBox = new DefaultValueBox(this._pinProperty, PinControl.formattedNameWidth(this._pinProperty), 0);
        }
    }

    public setHidden(hidden: boolean) {
        this.hidden = hidden;
    }

    public draw(canvas: Canvas2D): void {

        if (this.hidden)
            return;

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
        canvas.save();
        canvas.translate(this.position.x, this.position.y);
        let textX = this.setupTextDrawing(canvas);

        canvas.fillText(this._pinProperty.formattedName, textX, 4)
        .fillStyle(this._color)
        .fillCircle(6, 0, 2.3);

        if (this._pinProperty.isLinked) {
            canvas.fillCircle(0, 0, 6)
        } else {
            canvas.strokeStyle(this._color)
            .lineWidth(2)
            .strokeCircle(0, 0, 4.8)

            this.drawDefaultValueBox(canvas);
        }

        canvas.strokeStyle("#000")
        .lineWidth(.5)
        .strokeCircle(0, 0, 6);

        canvas.restore();
    }

    private drawExecutionPin(canvas: Canvas2D, drawText: boolean = false) {
        canvas.save();
        canvas.translate(this.position.x, this.position.y - 7);

        if (drawText) {
            let textX = this.setupTextDrawing(canvas);
            canvas.fillText(this._pinProperty.formattedName, textX, 10);
        }

        canvas.strokeStyle('#fff')
        .fillStyle('#fff')
        .lineWidth(1.1)
        .beginPath()
        .moveTo(-3, 0)
        .lineTo(1, 0)
        .lineTo(8, 6)
        .lineTo(8, 8)
        .lineTo(1, 14)
        .lineTo(-3, 14)
        .lineTo(-4, 13)
        .lineTo(-4, 1)
        .lineTo(-3, 0)
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

    private drawDefaultValueBox(canvas: Canvas2D) {
        if(this._defaultValueBox) {
            this._defaultValueBox.draw(canvas);
        }
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        let textX = -PinControl._PIN_NAME_PADDING_LEFT;

        if (this._isInput) {
            canvas.textAlign("left")
            textX = PinControl._PIN_NAME_PADDING_LEFT;
        }
        else
            canvas.textAlign("right")

        canvas.font('12px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    public static formattedNameWidth(pin: PinProperty): number {
        return Application.canvas.getContext().measureText(pin.formattedName).width + PinControl._PIN_NAME_PADDING_LEFT;
    }

    public static calculateTotalPinWidth(pin: PinProperty): number {
        let defaultValueBoxWidth = DefaultValueBox.defaultValueWidth(pin);
        if(defaultValueBoxWidth > 0) {
            defaultValueBoxWidth += Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT;
        }
        return PinControl.formattedNameWidth(pin) + defaultValueBoxWidth;
    }

    getAbsolutPosition(): Vector2 {
        return new Vector2(
            this._parentPosition.x + this.position.x,
            this._parentPosition.y + this.position.y
        );
    }
}
