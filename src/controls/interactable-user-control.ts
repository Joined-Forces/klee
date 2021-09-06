import { Canvas2D } from "../canvas";
import { UserControl } from "./user-control";

export class InteractableUserControl extends UserControl {


    protected onDraw(canvas: Canvas2D) {
    }

    onMouseDown(ev: MouseEvent): boolean {
        return false;
    }
    onMouseUp(ev: MouseEvent): boolean {
        return false;
    }
    onMouseEnter(ev: MouseEvent): boolean {
        return false;
    }
    onMouseLeave(ev: MouseEvent): boolean {
        return false;
    }
    onMouseMove(ev: MouseEvent): boolean {
        return false;
    }
}