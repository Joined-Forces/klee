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

    override getCalculatedSize(): Vector2 {
        let size = new Vector2(0, 0);
        let childHeight = 0;
        this.verticalFillCount = 0;

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            let childSize = child.getCalculatedSize();
            child.position.y = size.y;

            size.x = Math.max(size.x, childSize.x)
            size.y += childSize.y;

            if (child.fillParentVertical) {
                this.verticalFillCount++;
            } else {
                childHeight += childSize.y;
            }
        }


        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        this.controlSize = size.copy();
        this.childrenHeight = childHeight;

        return size;
    }

    private positionChildren() {
        if (this.childAlignment == HorizontalAlignment.RIGHT) {
            for (let child of this.children) {
                let rest = (this.size.x - this.padding.left) - child.size.x;
                child.position.x = rest;
            }
        }
    }


    override applyFills(remainingSize?: Vector2): void {
        let remainingHeight = (remainingSize?.y || this.size.y) - this.childrenHeight - (this.padding.top + this.padding.bottom);
        let width = this.size.x;
        let height = remainingHeight / this.verticalFillCount;

        let position = new Vector2(0, 0);

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            child.position.x = position.x;
            child.position.y = position.y;

            if (child.fillParentHorizontal) {
                child.desiredWidth = width;
            }
            if (child.fillParentVertical) {
                child.desiredHeight = height;
            }

            position.y += child.size.y + child.padding.top + child.padding.bottom;

            if (child instanceof Container) {
                (child as Container).applyFills(new Vector2(width, height));
            }
        }

        this.positionChildren();
    }
}