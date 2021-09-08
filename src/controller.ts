import { Application } from "./application";
import { NodeControl } from "./controls/nodes/node.control";
import { BoundingBox } from "./math/boundingbox";
import { Vector2 } from "./math/vector2";
import { InteractableControl, isInteractableControl } from "./controls/interfaces/interactable";
import { Control } from "./controls/control";
import { UserControl } from "./controls/user-control";
import { InteractableUserControl } from "./controls/interactable-user-control";

export interface KeyAction {
    keycode: string
    ctrl: boolean;
    callback: (ev: KeyboardEvent) => boolean
}

enum MouseButton {
    Left,
    Middle,
    Right
}

export class Controller {

    private _actions: KeyAction[] = [];

    private _mouseDownData: {
        buttonType: MouseButton,
        position: Vector2
    }
    private _mousePositionOfPreviousMove: Vector2;
    private _element: HTMLCanvasElement;

    private hoveredControls: InteractableUserControl[] = [];

    constructor(element: HTMLCanvasElement) {

        this._element = element;
        if (Application.isFirefox) {
            this._element.setAttribute("contenteditable", ""); // allow pasting to the canvas
            this._element.style.cursor = "default";
            this._element.style.color = "transparent"; // Hide caret
        }

        // A tabindex higher than -1 is needed so that html element reseaves focus events
        // which is required that the key events get fired.
        element.tabIndex = 0;

        element.onmousedown = (ev) => this.onMouseDown(ev);
        element.onmouseup = (ev) => this.onMouseUp(ev);
        element.onmousemove = (ev) => this.onMouseMove(ev);
        element.onmouseenter = (ev) => this.onMouseEnter(ev);
        element.onmouseleave = (ev) => this.onMouseLeave(ev);
        element.onkeydown = (ev) => this.onKeydown(ev);
        element.oncontextmenu = (ev) => this.onContextMenu(ev);

        this.registerAction({
            ctrl: true,
            keycode: 'KeyA',
            callback: this.selectAllNodes.bind(this),
        });
    }

    registerAction(action: KeyAction) {
        this._actions.push(action);
    }

    onKeydown(ev : KeyboardEvent) {
        for (const action of this._actions.filter(a => a.keycode === ev.code)) {
            if(action.ctrl !== ev.ctrlKey) continue;

            if (action.callback(ev)) {
                ev.preventDefault();
            }
        }
    }

    onMouseDown(ev: MouseEvent) {
        this._mouseDownData = {
            buttonType: ev.button,
            position: this.getMousePosition(ev)
        }
        this._mousePositionOfPreviousMove = this._mouseDownData.position;

        const mouseAbsolutePos = this.getAbsoluteMousePosition(ev);
        let controls = this.getIntersectingControls(mouseAbsolutePos, new Vector2(0, 0));
        controls = controls.sort((c1, c2) => { return c1.ZIndex - c2.ZIndex; })
        for (let control of controls) {
            if (control.onMouseDown(ev))
                break;
        }

        for (let control of this.hoveredControls) {
            if (controls.indexOf(control) < 0) {
                this.hoveredControls.splice(this.hoveredControls.indexOf(control), 1);
                if (isInteractableControl(control)) {
                    control.onMouseLeave(ev);
                }
            }
        }
        
        //Application.scene.refresh();
    }

    onMouseUp(ev: MouseEvent) {
        const currentMousePosition = this.getMousePosition(ev);
        const mouseAbsolutePos = this.getAbsoluteMousePosition(ev);



        let consumed = false;

        let controls = this.getIntersectingControls(mouseAbsolutePos, new Vector2(0, 0));
        controls = controls.sort((c1, c2) => { return c1.ZIndex - c2.ZIndex; })
        for (let control of controls) {
            if (isInteractableControl(control)) {
                if (consumed = control.onMouseUp(ev))
                    break;
            }
        }

        for (let control of this.hoveredControls) {
            if (controls.indexOf(control) < 0) {
                this.hoveredControls.splice(this.hoveredControls.indexOf(control), 1);
                if (isInteractableControl(control)) {
                    control.onMouseLeave(ev);
                }
            }
        }

        if (this._mouseDownData && !consumed) {
            const delta = currentMousePosition.subtract(this._mouseDownData.position);
    
            if (delta.x == 0 && delta.y == 0) {
                Application.scene.nodes.forEach(c => c.selected = false);
                this.selectIntersectingControls(mouseAbsolutePos, new Vector2(0,0));
            }
        }

        this._mouseDownData = null;
        Application.scene.refresh();
    }

    onMouseMove(ev: MouseEvent) {
        const currentMousePosition = this.getMousePosition(ev);
        const mouseAbsolutePos = this.getAbsoluteMousePosition(ev);

        if (this._mouseDownData) {
            if (this._mouseDownData.buttonType === MouseButton.Right) {
                const delta = currentMousePosition.subtract(this._mousePositionOfPreviousMove);
                this._mousePositionOfPreviousMove = currentMousePosition;

                Application.scene.camera.moveRelative(delta);
                Application.scene.refresh();
                return false;
            }

            if(this._mouseDownData.buttonType === MouseButton.Left) {
                const delta = currentMousePosition.subtract(this._mouseDownData.position);
                Application.scene.refresh();

                const mouseDownAbsolutePos = this.getAbsoluteMouseDownPosition(ev);
                this.drawMouseSelection(mouseDownAbsolutePos.x, mouseDownAbsolutePos.y, delta.x, delta.y);
                this.selectIntersectingControls(mouseDownAbsolutePos, delta);
                return false;
            }
        }

        let controls = this.getIntersectingControls(mouseAbsolutePos, new Vector2(0, 0));
        
        for (let control of controls) {
            if (this.hoveredControls.indexOf(control) < 0) {
                this.hoveredControls.push(control);
                if (isInteractableControl(control)) {
                    control.onMouseEnter(ev);
                }
            }
        }

        controls = controls.sort((c1, c2) => { return c1.ZIndex - c2.ZIndex; })
        for (let control of controls) {
            if (isInteractableControl(control)) {
                if (control.onMouseMove(ev))
                    break;
            }
        }

        for (let control of this.hoveredControls) {
            if (controls.indexOf(control) < 0) {
                this.hoveredControls.splice(this.hoveredControls.indexOf(control), 1);
                if (isInteractableControl(control)) {
                    control.onMouseLeave(ev);
                }
            }
        }

        return false;
    }

    onMouseEnter(ev: MouseEvent) {
        if (ev.buttons == 0) {
            this._mouseDownData = null;
        }
    }

    onMouseLeave(ev: MouseEvent) {
        if(this._mouseDownData) {
            if(this._mouseDownData.buttonType === MouseButton.Left) {

                Application.scene.nodes.forEach(c => c.selected = false);
                Application.scene.refresh();
                return false;
            }
        }
     }

    onContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }

    drawMouseSelection(x: number, y: number, sizeX: number, sizeY: number) {
        Application.canvas
            .save()
            .setLineDash([6])
            .strokeStyle('#fff')
            .lineWidth(2)
            .strokeRect(x, y, sizeX, sizeY)
            .restore();
    }

    selectIntersectingControls(pos: Vector2, size: Vector2): void {
        // Unselect all
        Application.scene.nodes.forEach(c => c.selected = false);

        const intersectingControls = this.getIntersectingNodeControls(pos, size);
        intersectingControls.forEach(c => c.selected = true);
    }

    getIntersectingNodeControls(pos: Vector2, size: Vector2): NodeControl[] {
        return Application.scene.nodes.filter(n => BoundingBox.checkIntersection(pos, size, n.position, n.size)) || [];
    }

    getIntersectingControls(pos: Vector2, size: Vector2): InteractableUserControl[] {
        return Application.scene.interactables.filter(n => BoundingBox.checkIntersection(pos, size, n.getAbsolutPosition(), n.size)) || [];
    }

    getAbsoluteMousePosition(ev: MouseEvent) {
        const cameraPos = Application.scene.camera.position;
        const currentMousePosition = this.getMousePosition(ev);
        const mouseAbsolutePos = new Vector2(currentMousePosition.x - cameraPos.x, currentMousePosition.y - cameraPos.y);

        return mouseAbsolutePos;
    }

    getAbsoluteMouseDownPosition(ev: MouseEvent) {
        const cameraPos = Application.scene.camera.position;
        const mouseAbsolutePos = new Vector2(this._mouseDownData.position.x - cameraPos.x, this._mouseDownData.position.y - cameraPos.y);

        return mouseAbsolutePos;
    }

    selectAllNodes() {
        Application.scene.nodes.forEach(c => c.selected = true);
        Application.scene.refresh();
        return true;
    }

    getMousePosition(ev): Vector2 {
        return new Vector2(ev.pageX - this._element.offsetLeft, ev.pageY - this._element.offsetTop);
    }
}

function InteractableControl() {
    throw new Error("Function not implemented.");
}

