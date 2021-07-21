export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vector2) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    subtract(vec: Vector2) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    divide(vec: Vector2) {
        return new Vector2(this.x / vec.x, this.y / vec.y);
    }

    multiply(vec: Vector2 | number) {
        if (vec instanceof Vector2)
            return new Vector2(this.x * vec.x, this.y * vec.y);
        else
            return new Vector2(this.x * vec, this.y * vec);
    }
}