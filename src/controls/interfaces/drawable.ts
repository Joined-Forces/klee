import { Canvas2D } from '../../canvas';

export interface DrawableControl {
    draw(canvas: Canvas2D): void;
}

export function isDrawableControl(object) : object is DrawableControl {
    const drawableControl = object as DrawableControl;
    return drawableControl.draw !== undefined;
}