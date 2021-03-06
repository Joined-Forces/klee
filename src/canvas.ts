import { Vector2 } from "./math/vector2";

export interface RoundedCornerValues {
    radiusTopLeft: number;
    radiusTopRight: number;
    radiusBottomRight: number;
    radiusBottomLeft: number;
}

export class Canvas2D {

    private _element: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private readonly _PI_TIMES_TWO: number;

    constructor(element: HTMLCanvasElement) {
        this._element = element;
        this._context = this._element.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this._PI_TIMES_TWO = Math.PI * 2;
    }

    getBoundingClientRect(): DOMRect {
        return this._element.getBoundingClientRect();
    }

    fillStyle(style: string | CanvasGradient | CanvasPattern) {
        this._context.fillStyle = style;
        return this;
    }

    strokeStyle(style: string | CanvasGradient | CanvasPattern) {
        this._context.strokeStyle = style;
        return this;
    }

    beginPath() {
        this._context.beginPath();
        return this;
    }

    closePath() {
        this._context.closePath();
        return this;
    }

    drawImage(image: CanvasImageSource, x: number, y: number, width: number, height: number) {
        this._context.drawImage(image, x, y, width, height)
        return this;
    }

    roundedRectangle(x: number, y: number, width: number, height: number, radius: number | RoundedCornerValues) {
        let radiusTopLeft: number;
        let radiusTopRight: number;
        let radiusBottomLeft: number;
        let radiusBottomRight: number;

        if (radius instanceof Object) {
            let cornerValues = radius as RoundedCornerValues;
            radiusTopLeft = cornerValues.radiusTopLeft;
            radiusTopRight = cornerValues.radiusTopRight;
            radiusBottomLeft = cornerValues.radiusBottomLeft;
            radiusBottomRight = cornerValues.radiusBottomRight;
        } else {
            radiusTopLeft = radius as number;
            radiusTopRight = radius as number;
            radiusBottomLeft = radius as number;
            radiusBottomRight = radius as number
        }

        this._context.beginPath();
        this._context.moveTo(x + radiusTopLeft, y);
        this._context.lineTo(x + width - radiusTopRight, y);
        this._context.quadraticCurveTo(x + width, y, x + width, y + radiusTopRight);
        this._context.lineTo(x + width, y + height - radiusBottomRight);
        this._context.quadraticCurveTo(x + width, y + height, x + width - radiusBottomRight, y + height);
        this._context.lineTo(x + radiusBottomLeft, y + height);
        this._context.quadraticCurveTo(x, y + height, x, y + height - radiusBottomLeft);
        this._context.lineTo(x, y + radiusTopLeft);
        this._context.quadraticCurveTo(x, y, x + radiusTopLeft, y);
        this._context.closePath();

        return this;
    }

    lineTo(x: number, y: number) {
        this._context.lineTo(x, y);
        return this;
    }

    quadraticCurveTo(controlX: number, controlY: number, x: number, y: number) {
        this._context.quadraticCurveTo(controlX, controlY, x, y);
        return this;
    }

    fill(fillRule?: CanvasFillRule): Canvas2D;
    fill(path: Path2D, fillRule?: CanvasFillRule): Canvas2D;
    fill(value?: Path2D | CanvasFillRule, fillRule?: CanvasFillRule): Canvas2D {
        if (value instanceof Path2D) {
            this._context.fill(value, fillRule);
        } else if (value !== undefined) {
            this._context.fill(value);
        } else {
            this._context.fill();
        }
        return this;
    }

    stroke(path?: Path2D): Canvas2D {
        if (path != undefined) {
            this._context.stroke(path);
        } else {
            this._context.stroke();
        }
        return this;
    }

    clear() {
        // Use the identity matrix while clearing the canvas
        this._context.setTransform(1, 0, 0, 1, 0, 0);
        this._context.clearRect(0, 0, this._element.width, this._element.height);
        return this;
    }

    translate(x: number, y: number) {
        this._context.translate(x, y);
        return this;
    }

    fillRect(x: number, y: number, width: number, height: number) {
        this._context.fillRect(x, y, width, height);
        return this;
    }

    strokeRect(x: number, y: number, width: number, height: number) {
        this._context.strokeRect(x, y, width, height);
        return this;
    }

    setLineDash(segments: Array<number>) {
        this._context.setLineDash(segments);
        return this;
    }

    fillCircle(x: number, y: number, radius: number) {
        this._context.beginPath();
        this._context.arc(x, y, radius, 0, this._PI_TIMES_TWO);
        this._context.fill();
        return this;
    }

    strokeCircle(x: number, y: number, radius: number) {
        this._context.beginPath();
        this._context.arc(x, y, radius, 0, this._PI_TIMES_TWO);
        this._context.stroke();
        return this;
    }

    fillText(text: string, x: number, y: number, maxWidth?: number) {
        this._context.fillText(text, x, y, maxWidth);
        return this;
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number) {
        this._context.strokeText(text, x, y, maxWidth);
        return this;
    }

    shadow(offset: Vector2, blur: number, color: string) {
        this._context.shadowOffsetX = offset.x;
        this._context.shadowOffsetY = offset.y;
        this._context.shadowBlur = blur;
        this._context.shadowColor = color;
        return this;
    }

    lineWidth(width: number) {
        this._context.lineWidth = width;
        return this;
    }

    moveTo(x: number, y: number) {
        this._context.moveTo(x, y);
        return this;
    }

    bezierCurveTo(controlPoint1x: number, controlPoint1y: number, controlPoint2x: number, controlPoint2y: number, x: number, y: number) {
        this._context.bezierCurveTo(controlPoint1x, controlPoint1y, controlPoint2x, controlPoint2y, x, y);
        return this;
    }

    save() {
        this._context.save();
        return this;
    }

    restore() {
        this._context.restore();
        return this;
    }

    font(font: string) {
        this._context.font = font;
        return this;
    }

    textAlign(textAlign: CanvasTextAlign) {
        this._context.textAlign = textAlign;
        return this;
    }

    getContext() : CanvasRenderingContext2D {
        return this._context;
    }

    get width() {
        return this._element.width;
    }

    get height() {
        return this._element.height;
    }
}