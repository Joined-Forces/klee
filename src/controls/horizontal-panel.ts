import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { Container } from "./container";
import { VerticalPanel } from "./vertical-panel";

export class HorizontalPanel extends Container {
    
    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.fillStyle("rgba(0,220,220,0.1)");
        canvas.lineWidth(1);
        canvas.fillRect(0, 0, this.size.x + this.padding.left + this.padding.right, this.size.y + this.padding.top + this.padding.bottom);
/// #endif
    }

    override getCalculatedSize(): Vector2 {
        let size = new Vector2(0, 0);
        let childWidth = 0;
        this.horizontalFillCount = 0;

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            let childSize = child.getCalculatedSize();
            child.position.x = size.x;

            size.x += childSize.x;
            size.y = Math.max(size.y, childSize.y)

            if (child.fillParentHorizontal) {
                this.horizontalFillCount++;
            } else {
                childWidth += childSize.x;
            }
        }

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        size.x = (this.width || size.x);
        size.y = (this.height || size.y);

        this.controlSize = size.copy();
        this.childrenWidth = childWidth;

        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;
        
        return size;
    }

    override applyFills(remainingSize?: Vector2): void {
        let remainingWidth = (remainingSize?.x || this.size.x) - this.childrenWidth - (this.padding.left + this.padding.right);
        let width = remainingWidth / this.horizontalFillCount;
        let height = this.size.y;

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

            position.x += child.size.x + (child.padding.left || 0) + (child.padding.right || 0);

            if (child instanceof Container) {
                (child as Container).applyFills(new Vector2(width, height));
            }
        }
    }
}