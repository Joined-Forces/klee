import { Canvas2D } from "../canvas";
import { CallFunctionNodeObject, NodeObject } from "../data/node-object";
import { DrawableControl } from "./interfaces/drawable";
import { NodeControlBase } from "./node-control-base";
import { ColorUtils } from "./utils/color-utils";


export class NodeControl extends NodeControlBase implements DrawableControl {

    strokeStyleBorder: string;

    fillStyle: string;
    fillStyleHeader: CanvasGradient;
    fillStyleText: string;


    constructor(node: NodeObject) {
        super(node);
        this.minHeight = 50;
        this.minWidth = 150;

        this.headerHeight = 24;

        this.fillStyle = "rgba(15,15,15,0.6)";
        this.fillStyleText = "rgb(210,210,210)";

        this.strokeStyleBorder = "rgb(0,0,0)";

        this.width = this.minWidth;
        this.height = this.minHeight;

        this.createPins();
    }


    initialize() {
        if (this.node.isMathFunction) {
            this.headerHeight = 0;
        }
        
        let headerColor = ColorUtils.getNodeColorForClass(this.node.class);

        let gradient = this.getContext().createLinearGradient(0, 0, 150, 0);
        gradient.addColorStop(0, 'rgb('+headerColor+')');
        gradient.addColorStop(1, 'rgba('+headerColor+',0)');
        this.fillStyleHeader = gradient;

        super.initialize();
    }

    draw(canvas: Canvas2D) {

        canvas.save();

        canvas.translate(this.position.x, this.position.y);

        canvas.fillStyle(this.fillStyle)
        .font('12px sans-serif')
        .roundedRectangle(0, 0, this.width, this.height, 5)
        .fill()
        
        if (this.node.isMathFunction) {
            let functionName = (this.node as CallFunctionNodeObject).functionReference.memberName;
            let operator = '';

            if (functionName.startsWith("Multiply"))
                operator = '×';
            if (functionName.startsWith("Divide"))
                operator = '÷';

                canvas.fillStyle(this.fillStyleText)
                .textAlign('center')
                .font('24px sans-serif')
                .fillText(operator, this.width * .5, this.height * .5 + 9);

        } else {
            this.drawTitle(canvas);
        }

        canvas.strokeStyle(this.strokeStyleBorder)
        .lineWidth(1)
        .roundedRectangle(0, 0, this.width, this.height, 5)
        .stroke();
        
        this.drawPins(canvas);

        canvas.restore();
    }

    drawTitle(canvas: Canvas2D) {
        canvas.fillStyle(this.fillStyleHeader)
        .roundedRectangle(0, 0, this.width, this.headerHeight, { radiusTopLeft: 5, radiusTopRight: 5, radiusBottomLeft: 0, radiusBottomRight: 0 })
        .fill()
        .font("bold 12px sans-serif")
        .textAlign('left')
        .fillStyle(this.fillStyleText)
        .fillText(this.node.getName(), 30, 18);
    }
}