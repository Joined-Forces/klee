import { Canvas2D } from "../../canvas";
import { Vector2 } from "../../math/vector2";
import { Control } from "../control";
import { Node } from "../../data/nodes/node";
import { NodePinsCreator } from "../utils/node-pins-creator";
import { PinControl } from "../pin.control";


export abstract class NodeControl extends Control {

    private static readonly _SELECTION_COLOR = 'rgb(231,158,0)';
    private static readonly _SELECTION_LINE_WIDTH = 2.5;

    private _node: Node;
    private _pins: Array<PinControl>;

    protected width: number;
    protected height: number;

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

    public get sourceText(): string {
        return this._node.sourceText;
    }

    protected get node(): Node {
        return this._node;
    }

    protected createPins(offset?: Vector2): void {
        offset = offset || new Vector2(0, 0);

        const pinsCreator = new NodePinsCreator(this._node, this.width);

        // Makes sure the node box is big enough to fit all the pins
        this.width = Math.max(this.width, pinsCreator.dimensions.width);
        this.height = Math.max(this.height, pinsCreator.dimensions.height + offset.y);

        this._pins = pinsCreator.createPins(this.position, offset);
    }

    protected drawPins(canvas: Canvas2D) {
        this._pins.forEach(p => p.draw(canvas));
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
