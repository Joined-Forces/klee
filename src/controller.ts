import { Application } from "./application";
import { Camera } from "./camera";
import { Vector2 } from "./math/vector2";

export class Controller {

    mouseDown: boolean;
    mouseDownPosition: Vector2;
    mousePosition: Vector2;

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

    onMouseDown(ev: MouseEvent) {
        if (ev.button == 2) {
            this.mouseDown = true;
            this.mouseDownPosition = new Vector2(ev.x, ev.y);
            this.mousePosition = this.mouseDownPosition;
        }
    }

    onMouseUp(ev: MouseEvent) {
        this.mouseDown = false;
    }

    onMouseMove(ev: MouseEvent) {
        if (this.mouseDown) {
            let position = new Vector2(ev.x, ev.y);
            let delta = position.subtract(this.mousePosition);
            this.mousePosition = position;

            Application.scene.camera.moveRelative(delta);
            Application.scene.refresh();
        }

        return false;
    }

    onMouseEnter(ev: MouseEvent) {
        if (ev.buttons == 0) {
            this.mouseDown = false;
        }
    }

    onMouseLeave(ev: MouseEvent) {

    }

    onContextMenu(ev: MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
    }

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
            //this.loadBlueprint(text);
        });
    }
}

