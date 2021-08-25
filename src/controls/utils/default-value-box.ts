import { Canvas2D } from "../../canvas";
import { Constants } from "../../constants";
import { Application } from "../../application";
import { PinProperty } from "../../data/pin/pin-property";


export class DefaultValueBox {

    private _x: number;
    private _y: number;
    private _pin: PinProperty;
    private _defaultValueWidth: number;


    // TODO: x evtl direkt bereits verschoben nach dem text
    constructor(pinProperty: PinProperty, x: number, y: number) {
        this._pin = pinProperty;
        this._x = x + Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT;
        this._y = y;
        this._defaultValueWidth = DefaultValueBox.defaultValueWidth(this._pin);
    }


    public static defaultValueWidth(pin: PinProperty): number {
        if(!pin.shouldDrawDefaultValueBox) { return 0; }
        return Application.canvas.getContext().measureText(pin.defaultValue).width + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING * 2;
    }

    public draw(canvas: Canvas2D): void {
        const BOX_HEIGHT = 16;
        const BOX_BORDER_RADIUS = 2;

        canvas
            .roundedRectangle(this._x, this._y - BOX_HEIGHT / 2, this._defaultValueWidth, BOX_HEIGHT, BOX_BORDER_RADIUS)
            .fillStyle('rgba(70,70,70,0.5)')
            .fill()
            .font('12px sans-serif')
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(this._pin.defaultValue, this._x + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, this._y + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING)
    }
}
