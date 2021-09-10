import { Camera } from "./camera";
import { Canvas2D } from "./canvas";
import { Background } from "./controls/background";
import { Control } from "./controls/control";
import { DrawableControl, isDrawableControl } from "./controls/interfaces/drawable";
import { NodeConnectionControl } from "./controls/node-connection.control";
import { NodeControl } from "./controls/nodes/node.control";
import { Vector2 } from "./math/vector2";
import { PinDirection } from "./data/pin/pin-direction";
import { NodePinsCreator } from "./controls/utils/node-pins-creator";
import { NodePartialConnectionControl } from "./controls/partial-node-connection.control";
import { PinControl } from "./controls/pin.control";
import { UserControl } from "./controls/user-control";
import { Container } from "./controls/container";
import { InteractableControl, isInteractableControl } from "./controls/interfaces/interactable";
import { InteractableUserControl } from "./controls/interactable-user-control";

export class Scene {

    private _canvas: Canvas2D;
    private _camera: Camera;

    private _controls: Array<Control>;
    private _nodes: Array<NodeControl>;
    private _interactables: Array<InteractableUserControl>;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
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

    get interactables() {
        return this._interactables || [];
    }

    collectInteractables() {
        let interactables: Array<InteractableUserControl> = [];
        this._controls.forEach((control) => {
            if (control instanceof InteractableUserControl) {
                interactables.push(control);
            }
            
            if (control instanceof Container) {
                this.findInteractablesIn(interactables, control);
            }
        });

        this._interactables = interactables;
    }

    private findInteractablesIn(interactables: Array<InteractableUserControl>, container: Container) {

        for (let child of container.getChildren()) {
            if (child instanceof InteractableUserControl) {
                interactables.push(child);
            }

            if (child instanceof Container) {
                this.findInteractablesIn(interactables, child);
            }
        }
    }

    updateLayout() {
        this._controls.forEach((control) => {
            if (control instanceof UserControl) {
                (control as UserControl).refreshLayout();
            }
        });
    }

    refresh() {
        this._canvas.clear();

        this._controls.sort((a, b) => {
            return a.ZIndex - b.ZIndex;
        });

        this._camera.prepareViewport();
        this._controls.forEach((control) => {
            if (isDrawableControl(control)) {
                (control as DrawableControl).draw(this._canvas);
            }
        });
    }

    unload() {
        NodePinsCreator.resetPinsControls();
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
    }

    load(dataNodes: NodeControl[]) {
        this.createBackground();

        this.createControlNodes(dataNodes);

        // Creates connection lines between pins
        this.createConnectionLines();
    }

    private createBackground() {
        let background = new Background(this.camera);
        this._controls.push(background);
    }

    private createControlNodes(controls: NodeControl[]) {
        for (const control of controls) {
            this._nodes.push(control);
            this._controls.push(control);
        }
    }

    private createConnectionLines() {
        const connections: string[] = [];
        const connectedPins: string[] = [];
        const pins = Array.from(NodePinsCreator.pinsControls);

        for (let i = pins.length - 1; i >= 0; --i) {
            let pin = pins[i];

            if (!pin.pinProperty.isLinked) {
                pins.splice(i, 1);
                continue;
            }

            if (pin.pinProperty.direction != PinDirection.EGPD_Output)
                continue;

            let wasConnected = false;
            for (let n = 0; n < pin.pinProperty.linkedTo.length; ++n) {
                let link = pin.pinProperty.linkedTo[n];
                let otherPin = pins.find(p => p.pinProperty.nodeName === link.nodeName && p.pinProperty.id === link.pinID);

                if (!otherPin)
                    continue;

                this._controls.push(new NodeConnectionControl(pin, otherPin));

                connectedPins.push(pin.pinProperty.getUniqueName());
                connectedPins.push(otherPin.pinProperty.getUniqueName());

                wasConnected = true;
            }

            if (wasConnected)
                pins.splice(i, 1);
        }

        // Go through pins which are connected to a missing node
        for (let i = pins.length - 1; i >= 0; --i) {
            let pin = pins[i];

            if (connectedPins.indexOf(pin.pinProperty.getUniqueName()) >= 0)
                continue;

            if (pin.pinProperty.isLinked) {
                let partialConnection = new NodePartialConnectionControl(pin);

                this._controls.push(partialConnection);
            }
        }
    }

    calculateCentroid(): Vector2 {
        let centroid = new Vector2(0, 0);

        if (this.nodes.length == 0)
            return centroid;

        this.nodes.forEach(node => {
            centroid = new Vector2(
                centroid.x - node.position.x,
                centroid.y - node.position.y);
        });

        return new Vector2(centroid.x / this.nodes.length, centroid.y / this.nodes.length);
    }
}
