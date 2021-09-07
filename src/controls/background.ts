import { Application } from "../application";
import { Camera } from "../camera";
import { Canvas2D } from "../canvas";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";

// TODO: Don't implement as background control. Move to camera
export class Background extends Control implements DrawableControl {

    ready: boolean;
    image: HTMLImageElement;
    imageURL: string;
    pattern: CanvasPattern;
    camera: Camera;

    constructor(imageURL: string, camera: Camera) {
        super(0, 0, -1000);

        this.imageURL = imageURL;
        this.camera = camera;
        this.ready = false;

        this.image = new Image();
        this.image.onload = (ev) => this.onLoaded(ev);
        this.image.src = this.imageURL;
    }

    draw(canvas: Canvas2D) {
        if (!this.ready) return;

        canvas.fillStyle(this.pattern)
            .fillRect(-this.camera.position.x, -this.camera.position.y, canvas.width, canvas.height);
    }

    private onLoaded(ev : Event) {
        this.pattern = Application.canvas.getContext().createPattern(this.image, 'repeat');
        this.ready = true;

        Application.scene.refresh();
    }
}
