import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { InteractableControl } from "./interfaces/interactable";
import { FoldableHeadedNodeControl } from "./nodes/foldable-headed-node.control";
import { NodeControl } from "./nodes/node.control";

export class NodeFoldButton extends Control implements DrawableControl, InteractableControl {

    private static readonly BUTTON_HEIGHT = 20;
    private static readonly BUTTON_MARGIN = 3;

    private foldout: boolean = false;
    private parentControl: NodeControl;
    private hovered: boolean = false;

    get foldoutState() { return this.foldout; }
    set foldoutState(value: boolean) { 
        this.foldout = value;
        Application.scene.refresh();
    }

    constructor(parentControl: NodeControl) {
        super(
            parentControl.position.x,
            parentControl.position.y + parentControl.size.y - NodeFoldButton.BUTTON_HEIGHT - NodeFoldButton.BUTTON_MARGIN
        );

        this.parentControl = parentControl;

        this.height = NodeFoldButton.BUTTON_HEIGHT;
        this.width = parentControl.size.x - (NodeFoldButton.BUTTON_MARGIN * 2);

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

    updatePosition(): void {
        this.position.y = this.parentControl.position.y + this.parentControl.size.y - NodeFoldButton.BUTTON_HEIGHT - NodeFoldButton.BUTTON_MARGIN;
    }

    onMouseMove(ev: MouseEvent): boolean {
        return false;
    }
    onMouseDown(ev: MouseEvent): boolean {
        return true;
    }
    onMouseUp(ev: MouseEvent): boolean {
        if (this.parentControl instanceof FoldableHeadedNodeControl === true) {
            (this.parentControl as FoldableHeadedNodeControl).toggleFold();
            this.foldoutState = !this.foldoutState;
        }
        return true;
    }

    draw(canvas: Canvas2D): void {
        canvas.save();

        canvas.translate(this.position.x, this.position.y);

        if (this.hovered) {
            canvas.fillStyle("rgba(255,255,255,0.1)")
            .fillRect(NodeFoldButton.BUTTON_MARGIN, 0, this.size.x, this.size.y);
        }
        this.drawChevron(canvas);

        canvas.restore();
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