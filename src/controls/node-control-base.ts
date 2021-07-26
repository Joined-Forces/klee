import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { PinCategory, PinDirection } from "../data/custom-property";
import { NodeObject } from "../data/node-object";
import { VariableGetNodeObject } from "../data/node-objects/variable-get-node-object";
import { PinProperty } from "../data/pin-property";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { PinControl } from "./pin-control";

export class NodeControlBase extends Control {

    private readonly _SELECTION_COLOR = 'rgb(231,158,0)';
    private readonly _SELECTION_LINE_WIDTH = 2.5;

    private _node: NodeObject;
    protected headerHeight: number;

    protected minHeight: number;
    protected minWidth: number;

    protected width: number;
    protected height: number;

    protected _inputPins: Array<PinControl>;
    protected _outputPins: Array<PinControl>;

    private _selected: boolean;
    protected _stroke: {
        lineWidth: number,
        style: string
    }

    constructor(node: NodeObject) {
        super(node.nodePosX, node.nodePosY);
        this._node = node;
        this._inputPins = [];
        this._outputPins = [];
        this._selected = false;
        this._stroke = {
            lineWidth: 1,
            style: 'rgb(0,0,0)'
        }
    }

    public get size(): Vector2 {
        return new Vector2(this.width, this.height);
    }

    public set selected(isSelected: boolean) {
        this._selected = isSelected;
    }

    public get selected(): boolean {
        return this._selected;
    }

    initialize(): void { 
        let pinRows = Math.max(this.getPinRows(this._inputPins), this.getPinRows(this._outputPins));
        let preferedHeight = pinRows * 24 + this.headerHeight + 6;
        if (preferedHeight > this.height) {
            this.height = preferedHeight;
        }

        let inputWidth = this.getMaxPinTextWidth(this._inputPins) + 25;
        let outputWidth = this.getMaxPinTextWidth(this._outputPins) + 25;

        let preferedWidth = inputWidth + outputWidth + 40;
        if (preferedWidth > this.width) {
            this.width = preferedWidth;
        }

        this.calculatePinPositions(this._inputPins);
        this.calculatePinPositions(this._outputPins);
    }

    get node(): NodeObject {
        return this._node;
    }

    protected createPins() {
        let properties = this.node.customProperties;

        for (let i = 0; i < properties.length; ++i) {
            if (properties[i] instanceof PinProperty) {
                let pinProperty = properties[i] as PinProperty;

                if (this._node instanceof VariableGetNodeObject) {
                    if (pinProperty.pinName === "self" && (this._node as VariableGetNodeObject).variableReference.selfContext) {
                        continue;
                    }
                }

                if (pinProperty.isHidden) {
                    continue;
                }

                let pin = new PinControl(this, pinProperty);

                if (pinProperty.direction == PinDirection.EGPD_Output) {
                    this._outputPins.push(pin);
                } else {
                    this._inputPins.push(pin);
                }
            }
        }
    }

    protected drawPins(canvas: Canvas2D) {
        for (let i = 0; i < this._inputPins.length; ++i) {
            this._inputPins[i].draw(canvas);
        }

        for (let i = 0; i < this._outputPins.length; ++i) {
            this._outputPins[i].draw(canvas);
        }
    }

    private calculatePinPositions(pins: Array<PinControl>) {
        let x = 0;
        let y = this.headerHeight - 10;

        for (let i = 0; i < pins.length; ++i) {
            if (pins[i].pinProperty.isKnotPin) {
                pins[i].position.x = 0;
                pins[i].position.y = 0;
                continue;
            }

            if (pins[i].pinProperty.isDelegatePin) {
                pins[i].position.x = this.width - 12;
                pins[i].position.y = 12;
                continue;
            }

            y = y + 24;
            x = 20;

            pins[i].position.y = y;
            

            if (pins[i].pinProperty.direction === PinDirection.EGPD_Output)
                x = this.width - 20;
        
            pins[i].position.x = x;
            
        }
    }

    private getMaxPinTextWidth(pins: Array<PinControl>): number {
        let width = 0;
        this.getContext().font = Constants.FONT_PIN;
        

        for (let i = 0; i < pins.length; ++i) {
            let textWidth = this.getContext().measureText(pins[i].pinProperty.getPinName()).width;

            if (textWidth > width) {
                width = textWidth;
            }
        }

        return width;
    }

    private getPinRows(pins: PinControl[]): number {
        let count = 0;
        for (let i = 0; i < pins.length; ++i) {
            if (pins[i].pinProperty.pinCategory !== PinCategory.delegate)
                count++;
        }

        return count;
    }

    protected drawStroke(canvas: Canvas2D) {
        if(this._selected) {
            canvas.lineWidth(this._SELECTION_LINE_WIDTH).strokeStyle(this._SELECTION_COLOR);
        } else {
            canvas.lineWidth(this._stroke.lineWidth).strokeStyle(this._stroke.style);
        }
        canvas.stroke();
    }

    get inputPins() {
        return this._inputPins;
    }

    get outputPins() {
        return this._outputPins;
    }
}