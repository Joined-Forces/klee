import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Control } from "./control";
import { InteractableUserControl } from "./interactable-user-control";
import { DrawableControl } from "./interfaces/drawable";
import { InteractableControl } from "./interfaces/interactable";
import { FoldableHeadedNodeControl } from "./nodes/foldable-headed-node.control";
import { NodeControl } from "./nodes/node.control";
import { UserControl } from "./user-control";

export class NodeFoldButton extends InteractableUserControl implements InteractableControl {

    private static readonly BUTTON_HEIGHT = 20;
    private static readonly BUTTON_MARGIN = 3;

    private foldout: boolean = false;
    private hovered: boolean = false;

    public onClick: (foldOut: boolean) => void;

    get foldoutState() { return this.foldout; }
    set foldoutState(value: boolean) { 
        this.foldout = value;
        Application.scene.refresh();
    }

    constructor(foldOut: boolean) {
        super();

        this.height = NodeFoldButton.BUTTON_HEIGHT;
        this.fillParentHorizontal = true;
        this.padding = { top: 0, right: 0, bottom: 3, left: 0 };
        this.foldout = foldOut;

        this.zIndex = 1;
    }


    onMouseEnter(ev: MouseEvent): boolean {
        this.hovered = true;
        Application.scene.refresh();
        return true;
    }
    onMouseLeave(ev: MouseEvent): boolean {
        this.hovered = false;
        Application.scene.refresh();
        return true;
    }

    onMouseDown(ev: MouseEvent): boolean {
        return true;
    }

    onMouseUp(ev: MouseEvent): boolean {
        this.foldoutState = !this.foldoutState;

        if (this.onClick)
            this.onClick(this.foldoutState)
        
        return true;
    }

    onDraw(canvas: Canvas2D): void {
/// #if DEBUG_UI
        canvas.strokeStyle("#e80");
        canvas.strokeRect(0, 0, this.size.x, this.size.y);
/// #endif
        if (this.hovered) {
            canvas.fillStyle("rgba(255,255,255,0.1)")
            .fillRect(0, 0, this.size.x, this.size.y);
        }
        this.drawChevron(canvas);
    }

    drawChevron(canvas: Canvas2D) {
        canvas.save();
        canvas.translate(this.size.x * 0.5, this.size.y * 0.5);

        canvas.fillStyle("#eee")
        .beginPath();
        if (this.foldoutState) {
            canvas.moveTo(5, 5)
            .lineTo(0, -2)
            .lineTo(-5, 5)
            .lineTo(5, 5);
        } else {
            canvas.moveTo(5, -2)
            .lineTo(0, 5)
            .lineTo(-5, -2)
            .lineTo(5, -2);
        }

        canvas.fill();

        canvas.restore();
    }
}