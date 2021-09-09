import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { Container } from "./container";

export class HorizontalPanel extends Container {
    
    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
    }

    protected onDraw(canvas: Canvas2D) {
/// #if DEBUG_UI
        canvas.strokeStyle("#0ee");
        canvas.lineWidth(1);
        canvas.strokeRect(-1, -1, this.size.x + 2, this.size.y + 2);
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

        

        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        size.x = (this.width || size.x);
        size.y = (this.height || size.y);

        this.controlSize = size.copy();
        this.childrenWidth = childWidth;
        
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

            position.x += child.size.x + child.padding.left + child.padding.right;

            if (child instanceof Container) {
                (child as Container).applyFills(new Vector2(width, height));
            }
        }
    }
}