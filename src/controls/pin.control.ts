import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { NodeConnectionControl } from "./node-connection.control";
import { NodeControl } from "./nodes/node.control";
import { UserControl } from "./user-control";
import { ColorUtils } from "./utils/color-utils";
import { DefaultValueBox } from "./utils/default-value-box";
import { NodePinsCreator } from "./utils/node-pins-creator";


export class PinControl extends UserControl {

    private static readonly PIN_NAME_PADDING_LEFT = 12;
    private static readonly PINS_PADDING_HORIZONTAL = 16;

    private _pinProperty: PinProperty;
    private defaultValueBox: DefaultValueBox;

    private category: PinCategory;

    private _isInput: boolean;
    private _color: string;
    private hidden: boolean;

    private connections: Array<NodeConnectionControl> = [];

    constructor(parentPosition: Vector2, pin: PinProperty) {
        super(0, 0);
        this._pinProperty = pin;
        this.hidden = false;

        this._isInput = this._pinProperty.direction !== PinDirection.EGPD_Output;
        this._color = ColorUtils.getPinColor(this._pinProperty);

        if (!pin.hidden && !pin.hideName) {
            this.width = PinControl.formattedNameWidth(this.pinProperty) + (PinControl.PINS_PADDING_HORIZONTAL * 2);
        } else if (!pin.hidden) {
            this.width = (PinControl.PINS_PADDING_HORIZONTAL * 2);
        }
        this.height = 28;
        this.padding = { top: 0, right: 0, bottom: 0, left: 0 };
        this.visible = !pin.hidden;
        this.category = pin.category;


        if (this.category == PinCategory.delegate) {
            this.width = (PinControl.PINS_PADDING_HORIZONTAL * 2);
            this.height = 24;
        }

        NodePinsCreator.pinsControls.push(this);
        this.postInit();
    }

    get pinProperty(): PinProperty {
        return this._pinProperty;
    }

    override set parent(value: UserControl) {
        this.controlParent = value;

        let nodeControl = this.findParent(NodeControl) as NodeControl;
        if (nodeControl) {
            if (this.pinProperty.advancedView == true && !nodeControl.showAdvanced && !this.pinProperty.isLinked) {
                this.visible = false;
            }
        }
    }

    public addConnection(connection: NodeConnectionControl) {
        this.connections.push(connection);
    }

    public postInit(): void {
        if (this.pinProperty.shouldDrawDefaultValueBox) {
            this.defaultValueBox = new DefaultValueBox(this._pinProperty, PinControl.formattedNameWidth(this._pinProperty) + PinControl.PINS_PADDING_HORIZONTAL, 0);
            this.width += this.defaultValueBox.getWidth();
        }
    }

    public setHidden(hidden: boolean) {
        this.hidden = hidden;
    }

    public override refreshLayout() {
        super.refreshLayout();

        for (let connection of this.connections) {
            
        }
    }

    public onDraw(canvas: Canvas2D): void {

        if (this.hidden)
            return;

/// #if DEBUG_UI
        canvas.strokeStyle("#e0e");
        canvas.strokeRect(0, 0, this.size.x, this.size.y);
/// #endif

        canvas.save();
        let pinCategory = this.pinProperty.category;
        canvas.fillStyle(this._color).strokeStyle(this._color);

        let paddingX = (this.pinProperty.direction === PinDirection.EGPD_Output) ? -this.padding.right : this.padding.left;
        canvas.translate(paddingX, this.height * 0.5);

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

        canvas.restore();
    }

    private drawPin(canvas: Canvas2D) {
        let textX = this.setupTextDrawing(canvas);
        const pinX = this.getPinX();

        canvas.fillText(this._pinProperty.formattedName, textX, 4)
        .fillStyle(this._color)
        .fillCircle(pinX + 6, 0, 2.3);

        if (this._pinProperty.isLinked) {
            canvas.fillCircle(pinX, 0, 6)
        } else {
            canvas.strokeStyle(this._color)
            .lineWidth(2)
            .strokeCircle(pinX, 0, 4.8)

            this.drawDefaultValueBox(canvas);
        }

        canvas.strokeStyle("#000")
        .lineWidth(.5)
        .strokeCircle(pinX, 0, 6);
    }

    private drawExecutionPin(canvas: Canvas2D) {
        canvas.save();
        
        if (this._pinProperty.formattedName) {
            const textX = this.setupTextDrawing(canvas);
            canvas.fillText(this._pinProperty.formattedName, textX, 4);
        }

        canvas.translate(this.getPinX(), -7);

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
        .translate(this.getPinX() - 3,  -5);

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
        if(this.defaultValueBox) {
            this.defaultValueBox.draw(canvas);
        }
    }

    private getPinX() : number {
        if (!this._isInput) {
            return this.size.x - PinControl.PINS_PADDING_HORIZONTAL;
        }
        return PinControl.PINS_PADDING_HORIZONTAL;
    }

    private setupTextDrawing(canvas: Canvas2D) : number {
        let textX = this.size.x - (PinControl.PIN_NAME_PADDING_LEFT + PinControl.PINS_PADDING_HORIZONTAL);

        if (this._isInput) {
            canvas.textAlign("left")
            textX = PinControl.PIN_NAME_PADDING_LEFT + PinControl.PINS_PADDING_HORIZONTAL;
        }
        else
            canvas.textAlign("right")

        canvas.font('12px sans-serif')
        .fillStyle("#eee");

        return textX;
    }

    public static formattedNameWidth(pin: PinProperty): number {
        return Application.canvas.font(Constants.NODE_FONT).getContext().measureText(pin.formattedName).width + PinControl.PIN_NAME_PADDING_LEFT;
    }

    public static calculateTotalPinWidth(pin: PinProperty): number {
        let defaultValueBoxWidth = DefaultValueBox.defaultValueWidth(pin);
        if(defaultValueBoxWidth > 0) {
            defaultValueBoxWidth += Constants.DEFAULT_VALUE_BOX_MARGIN_LEFT;
        }
        return PinControl.formattedNameWidth(pin) + defaultValueBoxWidth;
    }

    public getPinAbsolutePosition(): Vector2 {
        let position = this.getAbsolutPosition();
        position.y += this.height * 0.5;

        if (this.pinProperty.direction === PinDirection.EGPD_Output) {
            position.x += (this.width || this.size.x) - PinControl.PINS_PADDING_HORIZONTAL;
        } else {
            position.x += PinControl.PINS_PADDING_HORIZONTAL;
        }

        return position;
    }
}
