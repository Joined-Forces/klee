import { Application } from "../../application";
import { Constants } from "../../constants";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { Node } from "../../data/nodes/node";
import { PinCategory } from "../../data/pin/pin-category";
import { PinDirection } from "../../data/pin/pin-direction";
import { PinProperty } from "../../data/pin/pin-property";
import { Vector2 } from "../../math/vector2";
import { PinControl } from "../pin.control";

export class NodePinsCreator {

    private static _pinsControls: Array<PinControl> = [];

    public static get pinsControls(): Array<PinControl> {
        return NodePinsCreator._pinsControls;
    }

    public static resetPinsControls(): void {
        NodePinsCreator._pinsControls = new Array<PinControl>();
    }


    private static readonly _PINS_PADDING_HORIZONTAL = 16;
    private static readonly _PINS_PADDING_TOP = 12;
    private static readonly _SPACING_BETWEEN_INPUT_AND_OUTPUT_PINS = 5;
    private static readonly _PIN_ICON_WIDTH = 25;
    private static readonly _PIN_LINE_HEIGHT = 13;
    private static readonly _PIN_MARGIN_BOTTOM = 12;

    private _width: number;
    private _height: number;
    private _properties: Array<PinProperty>;
    private _inputPins: Array<PinProperty>;
    private _outputPins: Array<PinProperty>;
    private _node: Node;

    private requiredMinimumWidth: number;

    constructor(node: Node, requiredMinimumWidth: number) {

        this._width = 0;
        this._height = 0;

        this._properties = node.customProperties.filter(p => p instanceof PinProperty) as PinProperty[];
        this._inputPins = new Array<PinProperty>();
        this._outputPins = new Array<PinProperty>();

        this._properties.forEach(p => {
            if (p.direction == PinDirection.EGPD_Output) {
                this._outputPins.push(p);
            } else {
                this._inputPins.push(p);
            }
        })

        this._node = node;
        this.requiredMinimumWidth = requiredMinimumWidth;

        this.recalculateDimensions();
    }

    private recalculateDimensions(useAdvancedDisplay?: boolean) {
        this._height = 0;

        const pinRows = Math.max(this.getPinRows(this._inputPins, useAdvancedDisplay), this.getPinRows(this._outputPins, useAdvancedDisplay));
        this._height = pinRows * (NodePinsCreator._PIN_LINE_HEIGHT + NodePinsCreator._PIN_MARGIN_BOTTOM) + NodePinsCreator._PINS_PADDING_TOP;

        const inputWidth = this.getMaxPinTextWidth(this._inputPins, useAdvancedDisplay) + NodePinsCreator._PIN_ICON_WIDTH;
        const outputWidth = this.getMaxPinTextWidth(this._outputPins, useAdvancedDisplay) + NodePinsCreator._PIN_ICON_WIDTH;

        this._width = inputWidth + outputWidth;
        if(this._inputPins.length > 0 && this._outputPins.length > 0) {
            this._width += NodePinsCreator._SPACING_BETWEEN_INPUT_AND_OUTPUT_PINS;
        }

        this._width = Math.max(this.requiredMinimumWidth, this._width);
    }

    public get dimensions(): { width: number, height: number } {
        return { width: this._width, height: this._height }
    }

    public createPins(nodePosition: Vector2, offset?: Vector2): Array<PinControl> {

        const pinControls = this.calculatePinPositions(this._inputPins, nodePosition, offset);
        return pinControls.concat(this.calculatePinPositions(this._outputPins, nodePosition, offset));
    }

    private calculatePinPositions(pins: Array<PinProperty>, nodePosition: Vector2, offset?: Vector2): Array<PinControl> {
        let pinControls = [];
        let lastPinPosition = offset?.copy() || new Vector2(0, 0);

        lastPinPosition.y += (NodePinsCreator._PIN_LINE_HEIGHT / 2)    // Moves the pin exactly below the top line of the node box
                          + NodePinsCreator._PINS_PADDING_TOP;         // Gives a space between pin and top line of the node box

        for (const pinProperty of pins) {
            const pin = new PinControl(nodePosition, pinProperty);
            this.calculatePinPosition(pin, lastPinPosition);
            pin.postInit();

            pinControls.push(pin);
            NodePinsCreator.pinsControls.push(pin);
        }

        return pinControls;
    }

    private calculatePinPosition(pin: PinControl, lastPinPosition: Vector2, useAdvancedDisplay?: boolean) {

        if (this._node.class === UnrealNodeClass.KNOT) {
            pin.position.x = 0;
            pin.position.y = 0;
            return;
        }

        if (useAdvancedDisplay && pin.pinProperty.advancedView === true && !pin.pinProperty.isLinked) {
            pin.setHidden(true);
            return;
        } else {
            pin.setHidden(false);
        }

        if (pin.pinProperty.category === PinCategory.delegate) {
            pin.position.x = this._width - 12;
            pin.position.y = 12;
            return;
        }

        pin.position.y = lastPinPosition.y;
        lastPinPosition.y += NodePinsCreator._PIN_LINE_HEIGHT + NodePinsCreator._PIN_MARGIN_BOTTOM;

        // Horizontal alignment
        if (pin.pinProperty.direction === PinDirection.EGPD_Output) {
            // If right-justified
            pin.position.x = this._width - NodePinsCreator._PINS_PADDING_HORIZONTAL;
        } else {
            // left-justified
            pin.position.x = NodePinsCreator._PINS_PADDING_HORIZONTAL;
        }
    }

    public recalculatePinControlPositions(pins: Array<PinControl>, offset?: Vector2, useAdvancedDisplay?: boolean) {
        this.recalculateDimensions(useAdvancedDisplay);

        let pinPosition = offset?.copy() || new Vector2(0, 0);
        pinPosition.y += (NodePinsCreator._PIN_LINE_HEIGHT / 2)    // Moves the pin exactly below the top line of the node box
                          + NodePinsCreator._PINS_PADDING_TOP;         // Gives a space between pin and top line of the node box


        let inputPins = [];
        let outputPins = [];

        for (const pin of pins) {
            if (pin.pinProperty.direction === PinDirection.EGPD_Output)
                outputPins.push(pin);

            if (pin.pinProperty.direction === PinDirection.EGPD_Input)
                inputPins.push(pin);
        }
        
        let lastPinPosition = pinPosition.copy();
        for (const pin of inputPins) {
            this.calculatePinPosition(pin, lastPinPosition, useAdvancedDisplay);
        }

        lastPinPosition = pinPosition.copy();
        for (const pin of outputPins) {
            this.calculatePinPosition(pin, lastPinPosition, useAdvancedDisplay);
        }
    }


    private getMaxPinTextWidth(pins: Array<PinProperty>, useAdvancedDisplay?: boolean): number {
        let width = 0;
        Application.canvas.getContext().font = Constants.NODE_FONT;

        for (let i = 0; i < pins.length; ++i) {
            if (useAdvancedDisplay && pins[i].advancedView === true)
                continue;

            const textWidth = PinControl.calculateTotalPinWidth(pins[i]);

            if (textWidth > width) {
                width = textWidth;
            }
        }

        return width;
    }

    private getPinRows(pins: PinProperty[], useAdvancedDisplay?: boolean): number {
        let count = 0;
        for (let i = 0; i < pins.length; ++i) {
            if (useAdvancedDisplay && pins[i].advancedView === true && !pins[i].isLinked)
                continue;

            if (pins[i].category !== PinCategory.delegate)
                count++;
        }

        return count;
    }
}
