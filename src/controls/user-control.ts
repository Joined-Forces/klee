import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Vector2 } from "../math/vector2";
import { Control } from "./control";
import { DrawableControl } from "./interfaces/drawable";
import { PinControl } from "./pin.control";
import { Thickness } from "./thickness";

export abstract class UserControl extends Control implements DrawableControl {

    protected controlParent?: UserControl;
    public padding: Thickness = { top: 0, right: 0, bottom: 0, left: 0};
    public ignoreLayout: boolean;

    protected dirty: boolean;
    public controlSize: Vector2 = new Vector2(0, 0);

    public visible: boolean = true;

    constructor(x?: number, y?: number, zIndex?: number) {
        super(x, y, zIndex);
    }

    get parent(): UserControl {
        return this.controlParent;
    }

    set parent(value: UserControl) {
        this.controlParent = value;
    }

    draw(canvas: Canvas2D): void {
        if (!this.visible) {
            return;
        }

        canvas.save();
        canvas.translate(Math.round(this.position.x), Math.round(this.position.y));

        this.onDraw(canvas);
        canvas.restore();
    }

    protected abstract onDraw(canvas: Canvas2D);

    public refreshLayout() {
        this.controlSize = this.getCalculatedSize();
        this.setDirty(true);

        if (this.controlParent) {
            this.controlParent.refreshLayout();
        }
    }

    public getCalculatedSize(): Vector2 {
        
        let size = this.size;
        size.x += this.padding.left + this.padding.right;
        size.y += this.padding.top + this.padding.bottom;

        return size;
    }

    public get size(): Vector2 {
        let size = this.controlSize.copy();

        size.x = Math.max(size.x, (this.desiredWidth || 0));
        size.y = Math.max(size.y, (this.desiredHeight || 0));

        size.x = Math.max(size.x, (this.minWidth || 0));
        size.y = Math.max(size.y, (this.minHeight || 0));

        size.x = (this.width) ? this.width : size.x;
        size.y = (this.height) ? this.height : size.y;

        return size;
    }

    protected setDirty(value: boolean) {
        this.dirty = value;
    }

    public isDirty() {
        return this.dirty;
    }

    getAbsolutPosition(): Vector2 {
        let position = new Vector2(0, 0);

        if (this.controlParent !== undefined) {
            position = this.controlParent.getAbsolutPosition();
            position.y += this.controlParent.padding.top;
            position.x += this.controlParent.padding.left;
        }

        position.x += this.position.x;
        position.y += this.position.y;

        return position;
    }

    protected findParent(type: any): UserControl {
        if (this.controlParent === undefined)
            return undefined;

        if (this.controlParent instanceof type) {
            return this.controlParent;
        } else {
            return this.controlParent.findParent(type);
        }
    }
}