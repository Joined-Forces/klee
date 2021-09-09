import { Canvas2D } from "../../canvas";
import { Node } from "../../data/nodes/node";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Application } from "../../application";
import { Vector2 } from "../../math/vector2";
import { Constants } from "../../constants";
import { Header } from "../header";
import { HorizontalPanel } from "../horizontal-panel";
import { VerticalPanel } from "../vertical-panel";
import { PinProperty } from "../../data/pin/pin-property";
import { PinControl } from "../pin.control";
import { PinDirection } from "../../data/pin/pin-direction";
import { PinCategory } from "../../data/pin/pin-category";
import { WarningBar } from "../warning-bar";
import { prettifyText } from "../../utils/text-utils";


export class HeadedNodeControl extends NodeControl implements DrawableControl {

    private static readonly NODE_HEADER_TITLE_HEIGHT = 23;
    private static readonly NODE_HEADER_SUBTITLE_HEIGHT = 14;
    private static readonly NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE = 4;
    private static readonly NODE_HEADER_ICONS_WIDTH = 50;

    protected headerHeight = HeadedNodeControl.NODE_HEADER_TITLE_HEIGHT;
    private header: Header;

    constructor(node: Node, icon?: string) {
        super(node);

        let largestTitleWidth = Application.canvas.getContext().measureText(this.node.title).width;
        if (this.node.subTitles && this.node.subTitles.length > 0) {
            for (const subTitle of this.node.subTitles) {
                largestTitleWidth = Math.max(largestTitleWidth, Application.canvas.getContext().measureText(subTitle.text).width);
            }
            this.headerHeight += (HeadedNodeControl.NODE_HEADER_SPACE_BETWEEN_TITLE_AND_SUBTITLE - 2) + (HeadedNodeControl.NODE_HEADER_SUBTITLE_HEIGHT * node.subTitles.length);
        }

        this.minHeight = HeadedNodeControl.NODE_HEADER_TITLE_HEIGHT;
        this.minWidth = largestTitleWidth + HeadedNodeControl.NODE_HEADER_ICONS_WIDTH;
        this.minWidth = this.minWidth;



        this.header = new Header(node, icon);
        this.header.fillParentHorizontal = true;

        this.createPins(new Vector2(0, this.headerHeight));
        this.mainPanel.insert(this.header, 0);

        this.initializeEnabledState();
    }

    protected initializeEnabledState(): void {
        if (this.node.enabledState !== undefined) {
            this.mainPanel.add(new WarningBar(prettifyText(this.node.enabledState)));
        }
    }

    protected createPin(property: PinProperty) {
        let pinControl = new PinControl(this.position, property);
        this.pins.push(pinControl);

        if (property.direction == PinDirection.EGPD_Output) {
            if (property.category === PinCategory.delegate) {
                pinControl.fillParentVertical = true;
                this.header.addDelegate(pinControl);
                return;
            }
            this.outputPinPanel.add(pinControl);
        } else {
            this.inputPinPanel.add(pinControl);
        }
    }

    protected onDraw(canvas: Canvas2D) {
        super.onDraw(canvas);

        canvas.fillStyle(Constants.NODE_BACKGROUND_COLOR)
            .font(Constants.NODE_FONT)
            .roundedRectangle(0, 0, this.size.x, this.size.y, 5)
            .fill()

        canvas.roundedRectangle(0, 0, this.size.x, this.size.y, 5);
        this.drawStroke(canvas);
    }


}
