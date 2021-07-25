import { Canvas2D } from "../canvas";
import { NodeObject } from "../data/node-object";
import { Vector2 } from "../math/vector2";
import { DrawableControl } from "./interfaces/drawable";
import { NodeControlBase } from "./node-control-base";


export class GetterNodeControl extends NodeControlBase implements DrawableControl {

    minWidth: number;
    textWidth: number;

    fillStyle: string;
    fillStyleHeader: any;
    fillStyleText: string;

    constructor(node: NodeObject) {
        super(node);
        this.minWidth = 100;

        this.fillStyle = "rgba(15,15,15,0.6)";
        this.fillStyleText = "rgb(210,210,210)";

        this.headerHeight = -7;

        this.width = this.minWidth;
        this.height = 35;

        this.createPins();
    }

    initialize() {
        let headerColor = '109, 147, 104';

        let gradient = this.getContext().createLinearGradient(this.position.x, 0, this.position.x + 150, 0);
        gradient.addColorStop(0, 'rgb('+headerColor+')');
        gradient.addColorStop(1, 'rgba('+headerColor+',0)');
        this.fillStyleHeader = gradient;

        this.getContext().font = "bold 12px sans-serif";
        this.textWidth = this.getContext().measureText(this.node.getName()).width;

        super.initialize();
    }

    draw(canvas: Canvas2D) {
        canvas.save();
        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(this.fillStyle)
            .roundedRectangle(0, -(this.height * .3), this.width, this.height, 18)
            .fill()
            // .roundedRectangle(0, -(this.height * .3), this.width, this.height, 18) // TODO: Find out why

        this.drawStroke(canvas);
        this.drawPins(canvas);

        canvas.restore();

    }
}