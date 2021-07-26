import { Application } from "./application";
import { BoundingBox } from "./math/boundingbox";
import { Vector2 } from "./math/vector2";

export enum UserAction {
    Copy,
    Paste
}

export enum MouseButton {
    Left,
    Middle,
    Right
}

export class Controller {

    private _actions = {};

    private _mouseDownData: {
        buttonType: MouseButton,
        position: Vector2
    }
    private _mousePositionOfPreviousMove: Vector2;

    constructor(element: HTMLCanvasElement) {

        // A tabindex higher than -1 is needed so that html element reseaves focus events
        // which is required that the key events get fired.
        element.tabIndex = 0;

        element.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        element.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        element.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        element.addEventListener('mouseenter', this.onMouseEnter.bind(this), false);
        element.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
        element.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
        element.addEventListener('keydown', this.onKeydown.bind(this), false);
    }

    registerAction(action: UserAction, fnc: () => void) {
        this._actions[action] = fnc;
    }

    onKeydown(ev : KeyboardEvent) {
        let handled = false;
        if(ev.ctrlKey) {
            switch (ev.code) {
                case "KeyC": {  // Copy
                    this._actions[UserAction.Copy]();
                    handled = true;
                    break;
                }
                case "KeyV": { // Paste
                    this._actions[UserAction.Paste]();
                    handled = true;
                    break;
                }
            }
        }

        if(handled) {
            ev.preventDefault();
        }
    }

    onMouseDown(ev: MouseEvent) {
        this._mouseDownData = {
            buttonType: ev.button,
            position: new Vector2(ev.pageX, ev.pageY)
        }
        this._mousePositionOfPreviousMove = this._mouseDownData.position;

        Application.scene.nodes.forEach(c => c.selected = false);

        Application.scene.refresh();
    }

    onMouseUp(ev: MouseEvent) {
        this._mouseDownData = null;
        Application.scene.refresh();
    }

    onMouseMove(ev: MouseEvent) {
        if(!this._mouseDownData) { return; }

        const currentMousePosition = new Vector2(ev.pageX, ev.pageY);

        if (this._mouseDownData.buttonType === MouseButton.Right) {
            const delta = currentMousePosition.subtract(this._mousePositionOfPreviousMove);
            this._mousePositionOfPreviousMove = currentMousePosition;

            Application.scene.camera.moveRelative(delta);
            Application.scene.refresh();
        }

        if(this._mouseDownData.buttonType === MouseButton.Left) {
            const delta = currentMousePosition.subtract(this._mouseDownData.position);
            const cameraPos = Application.scene.camera.position;

            const mouseAbsolutePos = new Vector2(this._mouseDownData.position.x - cameraPos.x, this._mouseDownData.position.y - cameraPos.y);

            Application.scene.refresh();

            this.drawMouseSelection(mouseAbsolutePos.x, mouseAbsolutePos.y, delta.x, delta.y);
            this.selectIntersectingControls(mouseAbsolutePos, delta);
        }

        return false;
    }

    onMouseEnter(ev: MouseEvent) {
        if (ev.buttons == 0) {
            this._mouseDownData = null;
        }
    }

    onMouseLeave(ev: MouseEvent) { }

    onContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
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

        const intersectingControls = Application.scene.nodes.filter(n => BoundingBox.checkIntersection(pos, size, n.position, n.size)) || [];
        intersectingControls.forEach(c => c.selected = true);
    }
}

