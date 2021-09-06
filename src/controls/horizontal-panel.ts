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

    override getSize(): Vector2 {
        let size = new Vector2(0, 0);
        let autoChildrenSize = new Vector2(0, 0);
        let fillCount = 0;

        for (let child of this.children) {
            if (child.ignoreLayout || !child.visible)
                continue;

            let childSize = child.getSize();
            child.position.x = size.x;

            size.x += childSize.x;
            size.y = Math.max(size.y, childSize.y)

            if (child.fillParentHorizontal) {
                fillCount++;
            } else {
                autoChildrenSize.x += childSize.x;
                autoChildrenSize.y = Math.max(autoChildrenSize.y, childSize.y)
            }
        }

        for (let child of this.children) {
            child.desiredHeight = size.y;
        }

        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        size.x = (this.width || size.x);
        size.y = (this.height || size.y);

        this.controlSize = size.copy();
        this.calculateFills(autoChildrenSize, fillCount);

        return size;
    }

    private calculateFills(autoChildrenSize: Vector2, numberOfChildren: number) {

        let width = (this.size.x - autoChildrenSize.x) / numberOfChildren;

        for (let child of this.children) {
            if (child.fillParentHorizontal) {
                child.desiredWidth = width;
            }
        }
    }
}