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
import { PinDirection, PinProperty } from "./data/custom-property";
import { KnotNodeObject, NodeObject, VariableGetNodeObject } from "./data/node-object";
import { Vector2 } from "./math/vector2";
import { BlueprintParser } from "./parser/blueprint-parser";

export class Blueprint {

    canvas: Canvas2D;
    camera: Camera;
    controls: Array<Control>;

    parser: BlueprintParser;

    mouseDown: boolean;
    mouseDownPosition: Vector2;
    mousePosition: Vector2;

    innerHTML: string;

    nodes: Array<NodeControlBase>;
    pins: Array<PinControl>;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = new Canvas2D(canvas);
        this.camera = new Camera(this.canvas);

        this.clear();

        this.innerHTML = canvas.innerHTML;

        this.canvas.onMouseDown((ev: MouseEvent) => { return this.onMouseDown(ev) });
        this.canvas.onMouseUp((ev: MouseEvent) => { return this.onMouseUp(ev) });
        this.canvas.onMouseMove((ev: MouseEvent) => { return this.onMouseMove(ev) });
        this.canvas.onMouseEnter((ev: MouseEvent) => { return this.onMouseEnter(ev) });
        this.canvas.onMouseLeave((ev: MouseEvent) => { return this.onMouseLeave(ev) });
        this.canvas.onContextMenu((ev: MouseEvent) => { return this.onContextMenu(ev) });
        this.canvas.onKeydown((ev: KeyboardEvent) => { return this.onKeydown(ev) });

        this.parser = new BlueprintParser();

        this.initialize();
    }

    clear() {
        this.pins = new Array<PinControl>();
        this.nodes = new Array<NodeControlBase>();
        this.controls = new Array<Control>();
    }

    initialize() {
        this.canvas.getContext().font = "18px sans-serif";

        this.loadBlueprint(this.innerHTML);
    }

    loadBlueprint(blueprintText: string) {
        this.clear();

        let background = new Background('/assets/sprites/bp_grid.png', this.camera);
        this.addControl(background);

        let nodes = this.parser.parseBlueprint(blueprintText);
        this.createView(nodes);
    }


    // TODO: Move this out
    onMouseDown(ev: MouseEvent) {
        if (ev.button == 2) {
            this.mouseDown = true;
            this.mouseDownPosition = new Vector2(ev.x, ev.y);
            this.mousePosition = this.mouseDownPosition;
        }
    }

    // TODO: Move this out
    onMouseUp(ev: MouseEvent) {
        this.mouseDown = false;
    }

    // TODO: Move this out
    onMouseMove(ev: MouseEvent) {
        if (this.mouseDown) {
            let position = new Vector2(ev.x, ev.y);
            let delta = position.subtract(this.mousePosition);
            this.mousePosition = position;

            this.camera.moveRelative(delta);
            this.refresh();
        }

        return false;
    }

    // TODO: Move this out
    onMouseEnter(ev: MouseEvent) {
        if (ev.buttons == 0) {
            this.mouseDown = false;
        }
    }

    // TODO: Move this out
    onMouseLeave(ev: MouseEvent) {
        
    }

    // TODO: Move this out
    onContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    // TODO: Move this out
    onKeydown(ev : KeyboardEvent) {
        if(ev.ctrlKey) {
            switch (ev.code) {
                case "KeyC": this.copyBlueprintSelectionToClipboard();  // Copy
                case "KeyV": this.pasteClipboardContentToCanvas();      // Paste
            }
        }

        ev.preventDefault();
    }

    copyBlueprintSelectionToClipboard() {
        console.log("Copy selection");
        navigator.clipboard.writeText('');
    }

    pasteClipboardContentToCanvas() {
        // console.log((window as any).clipboardData.getData('Text'));
        navigator.clipboard.readText().then((text) => {
            if(!text) return;
            this.loadBlueprint(text);
        });
    }


    createView(nodes: Array<NodeObject>) {

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

            this.nodes.push(view);
            this.addControl(view);
        }

        for (let i = 0; i < this.nodes.length; ++i) {
            this.pins = this.pins.concat(this.nodes[i].inputPins)
            this.pins = this.pins.concat(this.nodes[i].outputPins)
        }

        for (let i = this.pins.length - 1; i >= 0; --i) {
            let pin = this.pins[i];
            if (pin.pinProperty.direction !== PinDirection.EGPD_Output)
                continue;


            let links = pin.pinProperty.linkedTo;

            if (!links)
                continue;

            for (let n = 0; n < pin.pinProperty.linkedTo.length; ++n) {
                let link = pin.pinProperty.linkedTo[n];
                let otherPin = this.findPinByID(link.pinID);

                if (!otherPin)
                    continue;

                let connection = new NodeConnection(pin, otherPin);
                this.addControl(connection);
            }

            let index = this.pins.indexOf(pin);
            if (index >= 0) {
                this.pins.splice(index, 1);
            }
        }
    }

    findPinByID(id: string): PinControl {
        for (let i = 0; i < this.pins.length; ++i) {
            if (this.pins[i].pinProperty.pinID == id) {
                return this.pins[i];
            }
        }

        return undefined;
    }

    addControl(control: Control) {
        control.blueprint = this;
        this.controls.push(control)

        control.initialize();
    }

    refresh() {
        this.canvas.clear();

        this.controls.sort((a, b) => {
            return a.zIndex - b.zIndex;
        });

        this.camera.prepareViewport();
        this.controls.forEach((control) => {
            if (isDrawableControl(control)) {
                (control as DrawableControl).draw(this.canvas);
            }
        })
    }
}

