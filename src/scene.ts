import { Camera } from "./camera";
import { Canvas2D } from "./canvas";
import { Background } from "./controls/background";
import { Control } from "./controls/control";
import { DrawableControl, isDrawableControl } from "./controls/interfaces/drawable";
import { NodeConnectionControl } from "./controls/node-connection.control";
import { NodeControl } from "./controls/nodes/node.control";
import { Vector2 } from "./math/vector2";
import { PinDirection } from "./data/pin/pin-direction";
import { NodePartialConnectionControl } from "./controls/partial-node-connection.control";
import { PinControl } from "./controls/pin.control";
import { UserControl } from "./controls/user-control";
import { Container } from "./controls/container";
import { InteractableControl, isInteractableControl } from "./controls/interfaces/interactable";
import { InteractableUserControl } from "./controls/interactable-user-control";
import { Application } from "./application";

export class Scene {

    private _canvas: Canvas2D;
    private _camera: Camera;

    private _controls: Array<Control>;
    private _nodes: Array<NodeControl>;
    private _pins: Array<PinControl>;
    private _interactables: Array<InteractableUserControl>;

    private app;

    constructor(canvas: Canvas2D, app: Application) {
        this.app = app;
        this._canvas = canvas;
        this._camera = new Camera(this._canvas);
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
        this._pins = new Array<PinControl>();
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
        this._pins = new Array<PinControl>();
        this._nodes = new Array<NodeControl>();
        this._controls = new Array<Control>();
    }

    load(dataNodes: NodeControl[]) {
        this.createBackground();
        this.createControlNodes(dataNodes);
        // Creates connection lines between pins

        this.createConnectionLines();

        this.initializeControls();
    }

    private createBackground() {
        let background = new Background(this.camera);
        this._controls.push(background);
    }

    private createControlNodes(controls: NodeControl[]) {
        for (const control of controls) {
            this._nodes.push(control);
            this._controls.push(control);

            this.collectPins(control);
        }
    }

    private collectPins(control: Control) {
        if (control instanceof Container) {
            for (let child of control.getChildren()) {
                if (child instanceof PinControl) {
                    this._pins.push(child);
                }
                if (child instanceof Container) {
                    this.collectPins(child);
                }
            }
        }
    }

    private createConnectionLines() {
        const connectedPins: string[] = [];
        const pins = this._pins;

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

    private initializeControls() {
        for (let control of this._controls) {
            this.initializeControl(control);
        }        
    }

    private initializeControl(control: Control) {
        control.initControl(this.app);

        if (control instanceof Container) {
            for (let child of control.getChildren()) {
                this.initializeControl(child);
            }
        }
    }

    calculateCentroid(): Vector2 {
        let centroid = new Vector2(0, 0);
 
        if (this.nodes.length == 0)
            return centroid;

        this.nodes.forEach(node => {
            centroid = new Vector2(
                centroid.x - node.position.x - (node.size.x * 0.5),
                centroid.y - node.position.y - (node.size.y * 0.5));
        });

        return new Vector2(centroid.x / this.nodes.length, centroid.y / this.nodes.length);
    }

    calculateCenterPoint() {
        if (this.nodes.length == 0)
            return new Vector2(0, 0);

        let xMin = Number.MAX_SAFE_INTEGER;
        let xMax = Number.MIN_SAFE_INTEGER;
        let yMin = Number.MAX_SAFE_INTEGER;
        let yMax = Number.MIN_SAFE_INTEGER;

        this.nodes.forEach(node => {
            xMin = Math.min(node.position.x, xMin);
            yMin = Math.min(node.position.y, yMin);
            xMax = Math.max(node.position.x + node.size.x, xMax);
            yMax = Math.max(node.position.y + node.size.y, yMax);
        });

        let width = xMax - xMin;
        let height = yMax - yMin;

        return new Vector2(-width * 0.5 -xMin , -height * 0.5 -yMin);
    }
}
