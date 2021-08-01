import { Camera } from "../camera";
import { Canvas2D } from "../canvas";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";

export class Background extends Control implements DrawableControl {

    ready: boolean;
    image: HTMLImageElement;
    imageURL: string;
    pattern: CanvasPattern;
    camera: Camera;

    constructor(imageURL: string, camera: Camera) {
        super(0, 0);

        this.zIndex = -1000;

        this.imageURL = imageURL;
        this.camera = camera;
        this.ready = false;
    }

    initialize() {
        this.image = new Image();
        this.image.addEventListener('load', (ev) => this.onLoaded(ev));
        this.image.src = this.imageURL;
    }

    onLoaded(ev : Event) {
        this.pattern = this.getContext().createPattern(this.image, 'repeat');
        this.ready = true;

        this.blueprint.refresh();
    }

    draw(canvas: Canvas2D) {
        if (!this.ready)
            return;

        canvas.fillStyle(this.pattern)
        .fillRect(-this.camera.position.x, -this.camera.position.y, canvas.width, canvas.height);
    }

}