import { Canvas2D } from "../canvas";
import { Constants } from "../constants";
import { UserControl } from "./user-control";


export class StructBoxControl extends UserControl {

    private entries: Array<{ key: string, value: string, x?: number, boxWidth?: number, keyWidth?: number }>;

    constructor(entries: Array<{ key: string, value: string }>) {
        super();

        this.height = Constants.DEFAULT_BOX_HEIGHT;
        this.entries = entries;
    }

    override initialize() {
        let totalWidth = 0;
        this.entries.forEach(e => {
            const keyWidth = this.app.canvas.getContext().measureText(`${e.key}`).width + 3;
            const valueWidth = this.app.canvas.getContext().measureText(`${e.value}`).width;
            const boxWidth = (keyWidth + valueWidth)                            // Width of the text
                           + (Constants.DEFAULT_VALUE_BOX_TEXT_PADDING * 2)     // Left and right box padding

            this.entries.push({
                key: e.key,
                value: e.value,
                x: totalWidth,
                keyWidth,
                boxWidth
            })
            totalWidth += boxWidth + 5; // Margin left;
        });

        this.width = totalWidth;
    }

    protected onDraw(canvas: Canvas2D) {
        this.entries.forEach(entry => {
            canvas // Draw background box
                .roundedRectangle(entry.x, 0 - Constants.DEFAULT_BOX_HEIGHT / 2, entry.boxWidth, Constants.DEFAULT_BOX_HEIGHT, Constants.DEFAULT_BOX_RADIUS)
                .fillStyle('rgba(70,70,70,0.5)')
                .fill()

            canvas // Draw key label
                .textAlign("left")
                .font('10px sans-serif')
                .fillStyle("#999")
                .fillText(`${entry.key}`, entry.x + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING)

            canvas // Draw value
                .textAlign("left")
                .font(Constants.NODE_FONT)
                .fillStyle("#ccc")
                .fillText(`${entry.value}`, entry.x + entry.keyWidth + Constants.DEFAULT_VALUE_BOX_TEXT_PADDING, Constants.DEFAULT_VALUE_BOX_TEXT_PADDING)
        });
    }
}
