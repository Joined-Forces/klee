import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { Container } from "./container";
import { UserControl } from "./user-control";

export enum HorizontalAlignment {
    LEFT,
    CENTER,
    RIGHT
}

export class VerticalPanel extends Container {

    public childAlignment: HorizontalAlignment = HorizontalAlignment.LEFT;

    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
    }

    protected onDraw(canvas: Canvas2D) { 
/// #if DEBUG_UI
            canvas.strokeStyle("#ee0");
            canvas.strokeRect(0, 0, this.size.x, this.size.y);
/// #endif
    }

    override getSize(): Vector2 {
        let size = new Vector2(0, 0);

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            let childSize = child.getSize();
            child.position.y = size.y;

            size.x = Math.max(size.x, childSize.x)
            size.y += childSize.y;
        }

        for (let child of this.children) {
            child.desiredWidth = size.x;
        }

        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        this.controlSize = size.copy();

        for (let child of this.children) {
            if (child.fillParentHorizontal) {
                child.desiredWidth = this.size.x - this.padding.left - this.padding.right;
            }
            if (child.fillParentVertical) {
                child.desiredHeight = this.size.y - this.padding.top - this.padding.top;
            }
        }

        this.positionChildren();

        return size;
    }

    private positionChildren() {
        if (this.childAlignment == HorizontalAlignment.RIGHT) {
            for (let child of this.children) {
                let rest = this.size.x - child.size.x;
                child.position.x = rest;
            }
        }
    }
}