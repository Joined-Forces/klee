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
import { Vector2 } from "./math/vector2";
import { CommentNodeControl } from "./controls/comment-node";
import { NodeClass } from "./data/node-class";

export class Scene {

    private _nodeObjects = {
        [NodeClass.KNOT]: (dn) => new RerouteNodeView(dn),
        [NodeClass.VARIABLE_GET]: (dn) => new GetterNodeControl(dn),
        [NodeClass.COMMENT]: (dn) => new CommentNodeControl(dn),
    }

    private _canvas: Canvas2D;
    private _camera: Camera;
    private _controls: Array<Control>;

    private _nodes: Array<NodeControlBase>;
    private _pins: Array<PinControl>;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);

        this.unload();
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

    load(dataNodes: NodeObject[]) {
        this.unload();

        this.createBackground();

        this.createControlNodes(dataNodes);

        // Collects pins from all node controls
        this.nodes.forEach(n => this._pins = this._pins.concat(n.inputPins, n.outputPins));

        // Creates connection lines between pins
        this.createConnectionLines();
    }

    private createBackground() {
        let background = new Background('/assets/sprites/bp_grid.png', this.camera);
        this.addControl(background);
    }

    private createControlNodes(dataNodes: NodeObject[]) {
        for (const dataNode of dataNodes) {
            const instantiateControl = this._nodeObjects[dataNode.class] || ((dn) => new NodeControl(dn));
            const control: NodeControlBase = instantiateControl(dataNode);

            this._nodes.push(control);
            this.addControl(control);
        }
    }

    private createConnectionLines() {
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

    private addControl(control: Control) {
        control.blueprint = this;
        this._controls.push(control)

        control.initialize();
    }

    calculateCentroid(): Vector2 {
        let centroid = new Vector2(0, 0);

        this.nodes.forEach(node => {
            centroid = new Vector2(
                centroid.x - node.position.x - node.size.x / 2,
                centroid.y - node.position.y - node.size.y / 2);
        });

        return new Vector2(centroid.x / this.nodes.length, centroid.y / this.nodes.length);
    }
}

