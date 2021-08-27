export interface InteractableControl {
    onMouseDown(ev: MouseEvent): boolean;
    onMouseUp(ev: MouseEvent): boolean;
    onMouseEnter(ev: MouseEvent): boolean;
    onMouseLeave(ev: MouseEvent): boolean;
    onMouseMove(ev: MouseEvent): boolean;
}

export function isInteractableControl(object) : object is InteractableControl {
    const drawableControl = object as InteractableControl;
    return drawableControl.onMouseDown !== undefined
        && drawableControl.onMouseUp !== undefined
        && drawableControl.onMouseEnter !== undefined
        && drawableControl.onMouseLeave !== undefined
        && drawableControl.onMouseMove !== undefined;
}
