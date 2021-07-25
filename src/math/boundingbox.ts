import { Vector2 } from "./vector2";

export class BoundingBox {
    static checkIntersection(pos1: Vector2, size1: Vector2, pos2: Vector2, size2: Vector2): boolean {
        this.absRect(pos1, size1);
        this.absRect(pos2, size2);

        if (pos1.x < pos2.x + size2.x &&
            pos1.x + size1.x > pos2.x &&
            pos1.y < pos2.y + size2.y &&
            pos1.y + size1.y > pos2.y) {
            return true; 
        }
        return false;
    }

    /**
     * This method mirrors the rectangle so that both axes are positive if the size is negative.
     */
    static absRect(pos: Vector2, size: Vector2): void {
        if(size.x < 0) {
            pos.x += size.x;
            size.x = Math.abs(size.x);
        }

        if(size.y < 0) {
            pos.y += size.y;
            size.y = Math.abs(size.y);
        }
    }
}