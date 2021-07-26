import { Camera } from "./camera";
import { Canvas2D } from "./canvas";
import { Background } from "./controls/background";
import { Control } from "./controls/control";
import { GetterNodeControl } from "./controls/getter-node-control";
import { DrawableControl, isDrawableControl } from "./controls/interfaces/drawable";
import { NodeConnection } from "./controls/node-connection";
import { NodeControlBase } from "./controls/node-control-base";
import { NodeControl } from "./controls/node-control";
import { PinControl } from "./controls/pin-control";
import { RerouteNodeView } from "./controls/reroute-node";
import { PinDirection } from "./data/custom-property";
import { NodeObject } from "./data/node-object";
import { KnotNodeObject } from "./data/node-objects/knot-node-object";
import { VariableGetNodeObject } from "./data/node-objects/variable-get-node-object";

export class Scene {

    private _canvas: Canvas2D;
    private _camera: Camera;
    private _controls: Array<Control>;

    private _nodes: Array<NodeControlBase>;
    private _pins: Array<PinControl>;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);
    }

    // TODO: Move this out
    get camera() {
        return this._camera;
    }

    get canvas() {
        return this._canvas;
    }

    get nodes() {
        return this._nodes || [];
    }

    refresh() {
        this._canvas.clear();

        this._controls.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });

        this._camera.prepareViewport();
        this._controls.forEach((control) => {
            if (isDrawableControl(control)) {
                (control as DrawableControl).draw(this._canvas);
            }
        });
    }

    unload() {
        this._pins = new Array<PinControl>();
        this._nodes = new Array<NodeControlBase>();
        this._controls = new Array<Control>();
    }

    load(nodes: NodeObject[]) {

        this.unload();

        this._canvas.getContext().font = "18px sans-serif";

        let background = new Background('/assets/sprites/bp_grid.png', this.camera);
        this.addControl(background);

        for (let i = 0; i < nodes.length; ++i) {
            let node = nodes[i];
            let view: NodeControlBase;

            if (node instanceof KnotNodeObject) {
                view = new RerouteNodeView(node);
            } else if (node instanceof VariableGetNodeObject) {
                view = new GetterNodeControl(node);
            } else {
                view = new NodeControl(node);
            }

            this._nodes.push(view);
            this.addControl(view);
        }

        for (let i = 0; i < this._nodes.length; ++i) {
            this._pins = this._pins.concat(this._nodes[i].inputPins)
            this._pins = this._pins.concat(this._nodes[i].outputPins) // TODO Why?
        }

        for (let i = this._pins.length - 1; i >= 0; --i) {
            let pin = this._pins[i];
            if (pin.pinProperty.direction !== PinDirection.EGPD_Output)
                continue;


            let links = pin.pinProperty.linkedTo;

            if (!links)
                continue;

            for (let n = 0; n < pin.pinProperty.linkedTo.length; ++n) {
                let link = pin.pinProperty.linkedTo[n];
                let otherPin = this._pins.find(p => p.pinProperty.pinID === link.pinID);

                if (!otherPin)
                    continue;

                let connection = new NodeConnection(pin, otherPin);
                this.addControl(connection);
            }

            let index = this._pins.indexOf(pin);
            if (index >= 0) {
                this._pins.splice(index, 1);
            }
        }
    }

    addControl(control: Control) {
        control.blueprint = this;
        this._controls.push(control)

        control.initialize();
    }
}

