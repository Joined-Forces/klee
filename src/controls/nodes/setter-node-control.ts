import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { NodeControl } from "./node.control";
import { Vector2 } from "../../math/vector2";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";
import { HeadlessNodeControl } from "./headless-node-control";


export class SetterNodeControl extends HeadlessNodeControl implements DrawableControl {

    protected drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font(Constants.NODE_HEADER_FONT)
            .textAlign('center')
            .fillStyle(Constants.NODE_TEXT_COLOR)
            .fillText(this.node.title, this.width/2, 16);
    }
}
