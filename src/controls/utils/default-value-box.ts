import { Canvas2D } from "../../canvas";
import { Constants } from "../../constants";
import { Application } from "../../application";
import { PinProperty } from "../../data/pin/pin-property";
import { IconLibrary } from "./icon-library";


export class DefaultValueBox {

    private x: number;
    private y: number;
    private pin: PinProperty;
    private defaultValueWidth: number;
    private boxes: any[];
    private defaultValues: any[];

    // TODO: x evtl direkt bereits verschoben nach dem text
    constructor(pinProperty: PinProperty, x: number, y: number) {
        this.pin = pinProperty;
        this.x = x + Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT;
        this.y = y;
        this.boxes = [];

        let offsetX = this.x;
        this.defaultValues = [];
        this.defaultValueWidth = 0;
        if (Array.isArray(this.pin.defaultValue)) {
            this.defaultValues = this.pin.defaultValue;
        } else {
            this.defaultValues = [this.pin.defaultValue];
        }

        this.defaultValues.forEach(v => {
            const w = Application.canvas.getContext().measureText(v).width + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING * 2;
            this.boxes.push({
                value: v,
                x: offsetX,
                width: w
            })
            this.defaultValueWidth += w + 5;
            offsetX += w + 5;
        });

        this.defaultValueWidth = DefaultValueBox.defaultValueWidth(this.pin);
    }


    public static defaultValueWidth(pin: PinProperty): number {
        if(!pin.shouldDrawDefaultValueBox) { return 0; }
        return Application.canvas.getContext().measureText(pin.defaultValue).width + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING * 2;
    }

    public draw(canvas: Canvas2D): void {
        this.boxes.forEach(o => {
            switch (typeof o.value) {
                case 'boolean':
                    this.drawCheckBox(canvas, o.value, o.x, o.width);
                    break;

                default:
                    this.drawTextBox(canvas, o.value, o.x, o.width);
                    break;
            }

        })
    }


    private drawCheckBox(canvas: Canvas2D, value: string, x: number, w: number): void {
        const BOX_HEIGHT = 16;
        const BOX_BORDER_RADIUS = 2;

        const icon = new Path2D(value ? IconLibrary.DEFAULT_VALUE_BOOL_TRUE : IconLibrary.DEFAULT_VALUE_BOOL_FALSE);

        canvas
            .roundedRectangle(x, this.y - BOX_HEIGHT / 2, w, BOX_HEIGHT, BOX_BORDER_RADIUS)
            .fillStyle('rgba(70,70,70,0.5)')
            .fill()

        canvas
            .fillStyle(Constants.NODE_TEXT_COLOR)
            .translate(x, this.y - BOX_HEIGHT / 2)
            .fill(icon, 'evenodd');
    }

    private drawTextBox(canvas: Canvas2D, value: string, x: number, w: number): void {
        const BOX_HEIGHT = 16;
        const BOX_BORDER_RADIUS = 2;

        canvas
            .roundedRectangle(x, this.y - BOX_HEIGHT / 2, w, BOX_HEIGHT, BOX_BORDER_RADIUS)
            .fillStyle('rgba(70,70,70,0.5)')
            .fill()
            .font('12px sans-serif')
            .fillStyle("#ccc")
            .textAlign("left")
            .fillText(value, x + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, this.y + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING)
    }

    public getWidth(): number {
        return this.defaultValueWidth;
    }
}
