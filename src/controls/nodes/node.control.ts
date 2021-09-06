import { Canvas2D } from "../../canvas";
import { Vector2 } from "../../math/vector2";
import { Control } from "../control";
import { Node } from "../../data/nodes/node";
import { NodePinsCreator } from "../utils/node-pins-creator";
import { PinControl } from "../pin.control";
import { UserControl } from "../user-control";
import { HorizontalAlignment, VerticalPanel } from "../vertical-panel";
import { HorizontalPanel } from "../horizontal-panel";
import { PinProperty } from "../../data/pin/pin-property";
import { PinDirection } from "../../data/pin/pin-direction";
import { Application } from "../../application";
import { Container } from "../container";


export abstract class NodeControl extends Container {

    private static readonly _SELECTION_COLOR = 'rgb(231,158,0)';
    private static readonly _SELECTION_LINE_WIDTH = 2.5;

    private _node: Node;
    protected pins: Array<PinControl> = [];

    protected mainPanel: VerticalPanel;
    protected inputPinPanel: VerticalPanel;
    protected outputPinPanel: VerticalPanel;

    public showAdvanced: boolean;


    private _selected: boolean;
    protected _stroke: {
        lineWidth: number,
        style: string
    }

    constructor(node: Node) {
        super(node.pos.x, node.pos.y);
        this._node = node;
        this.width = 0;
        this.height = 0;

        this._selected = false;
        this._stroke = {
            lineWidth: 1,
            style: 'rgb(0,0,0)'
        }

        this.showAdvanced = node.advancedPinDisplay;

        this.mainPanel = new VerticalPanel();
        let pinPanel = new HorizontalPanel();
        this.inputPinPanel = new VerticalPanel();
        this.outputPinPanel = new VerticalPanel();
        this.outputPinPanel.childAlignment = HorizontalAlignment.RIGHT;
        this.outputPinPanel.fillParentHorizontal = true;

        pinPanel.add(this.inputPinPanel);
        pinPanel.add(this.outputPinPanel);
        pinPanel.fillParentHorizontal = true;
        
        this.mainPanel.add(pinPanel);
        this.mainPanel.fillParentHorizontal = true;

        this.add(this.mainPanel);
    }


    public set selected(isSelected: boolean) {
        this._selected = isSelected;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public get sourceText(): string {
        return this._node.sourceText;
    }

    protected get node(): Node {
        return this._node;
    }

    protected createPins(offset?: Vector2): void {
        for (let property of this.node.customProperties) {
            if (property instanceof PinProperty) {
                this.createPin(property);
            }
        }
    }

    protected createPin(property: PinProperty) {
        let pinControl = new PinControl(this.position, property);
        this.pins.push(pinControl);
        this.onPinCreated(pinControl);
    }

    protected onPinCreated(pin: PinControl) {
        if (pin.pinProperty.direction == PinDirection.EGPD_Output) {
            this.outputPinPanel.add(pin);
        } else {
            this.inputPinPanel.add(pin);
        }
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#e00");
        canvas.strokeRect(0, 0, this.size.x, this.size.y);
/// #endif
    }

    protected drawStroke(canvas: Canvas2D) {
        if(this._selected) {
            canvas.lineWidth(NodeControl._SELECTION_LINE_WIDTH).strokeStyle(NodeControl._SELECTION_COLOR);
        } else {
            canvas.lineWidth(this._stroke.lineWidth).strokeStyle(this._stroke.style);
        }
        canvas.stroke();
    }
}
