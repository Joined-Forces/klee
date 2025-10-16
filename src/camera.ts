import { Canvas2D } from "./canvas";
import { Vector2 } from "./math/vector2";

export const StartingPositionType = {
    CENTER: "center",
    TOP_LEFT: "top-left"
};

export class Camera {

    private _canvas: Canvas2D;
    private _position: Vector2;
    private _startingPosition: Vector2;
    private _zoom: number = 1.0;
    private _minZoom: number = 0.5;
    private _maxZoom: number = 2.0;
    private _startingPositionType = StartingPositionType.CENTER;

    constructor(canvas: Canvas2D) {
        this._canvas = canvas;
        this._position = new Vector2(0, 0);
        this._startingPosition = new Vector2(0, 0);
    }

    public get position(): Vector2 {
        return this._position;
    }

    public get startingPosition(): string {
        return this._startingPositionType;
    }

    public set startingPosition(position: string) {
        this._startingPositionType = position;
    }

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(value: number) {
        this._zoom = Math.max(this._minZoom, Math.min(this._maxZoom, value));
    }

    public get isAtMinZoom(): boolean {
        return this._zoom <= this._minZoom;
    }

    public get isAtMaxZoom(): boolean {
        return this._zoom >= this._maxZoom;
    }

    prepareViewport() {
        this._canvas.translate(Math.round(this._position.x), Math.round(this._position.y));
        this._canvas.scale(this._zoom, this._zoom);
    }

    moveRelative(value: Vector2) {
        this._position = this._position.add(value);
    }

    centerAbsolutePosition(value: Vector2) {
        this._position = new Vector2(
            Math.round(value.x + this._canvas.width / 2),
            Math.round(value.y + this._canvas.height / 2));
    }

    positionAt(value: Vector2) {
        this._position = new Vector2(
            Math.round(value.x),
            Math.round(value.y));
    }

    zoomIn(factor: number = 1.2) {
        if (this._startingPositionType === StartingPositionType.TOP_LEFT) {
            this.zoomAtPoint(factor, this._position.x, this._position.y);
        }
        else {
            const centerX = this._canvas.width / 2;
            const centerY = this._canvas.height / 2;
            this.zoomAtPoint(factor, centerX, centerY);
        }
    }

    zoomOut(factor: number = 0.8) {
        if (this._startingPositionType === StartingPositionType.TOP_LEFT) {
            this.zoomAtPoint(factor, this._position.x, this._position.y);
        }
        else {
            const centerX = this._canvas.width / 2;
            const centerY = this._canvas.height / 2;
            this.zoomAtPoint(factor, centerX, centerY);
        }
    }

    private zoomAtPoint(factor: number, centerX: number, centerY: number) {
        const oldZoom = this._zoom;
        this.zoom = this._zoom * factor;
        const actualFactor = this._zoom / oldZoom;

        // Adjust position so zoom appears centered at the specified point
        const offsetX = (centerX - this._position.x) * (1 - actualFactor);
        const offsetY = (centerY - this._position.y) * (1 - actualFactor);

        this._position = this._position.add(new Vector2(offsetX, offsetY));
    }

    setStartingPosition(position: Vector2) {
        this._startingPosition = position.copy();
        this._position = position.copy();
    }

    resetZoom() {
        this._zoom = 1.0;
        this._position = this._startingPosition.copy();
    }
}
