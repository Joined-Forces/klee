import { Application } from "../application";
import { Canvas2D } from "../canvas";
import { Container } from "./container";
import { Label } from "./label";
import { UserControl } from "./user-control";
import { VerticalPanel } from "./vertical-panel";


export class WarningBar extends VerticalPanel {

    private image: any;
    private svg: any;
    private pattern: CanvasPattern;
    private color: string = "#FFE32F";
    private label: Label;

    constructor(text?: string) {
        super();
        
        this.svg = new Image();
        this.svg.src = 'data:image/svg+xml,' + escape('<svg width="32px" height="32px" viewBox="0 5 32 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M16,6.988l-16,0l-16,18.024l16,-0l16,-18.024Z" style="fill:'+this.color+';fill-opacity:0.4;"/><path d="M48,6.988l-16,0l-16,18.024l16,-0l16,-18.024Z" style="fill:'+this.color+';fill-opacity:0.4;"/></svg>');
        this.svg.width = "25px";
        this.svg.height = "25px";
        this.svg.onload = () => { this.imageLoaded() };

        this.fillParentHorizontal = true;

        this.minHeight = 25;

        this.label = new Label(text);
        this.label.fillParentHorizontal = true;
        this.label.textAlign = 'center';
        this.label.padding = { top: 7, right: 0, bottom: 5, left: 0 }
        this.add(this.label);
    }


    protected override onDraw(canvas: Canvas2D) {
        canvas.fillStyle(this.pattern);
        canvas.fillRect(0, 0, this.size.x, this.size.y);
    }

    private imageLoaded() {
        this.pattern = Application.canvas.getContext().createPattern(this.svg, 'repeat');
        Application.scene.refresh();
    }

}