import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { Constants } from "../../constants";
import { Node } from "../../data/nodes/node";
import { HeadlessNodeControl } from "./headless-node-control";


export class SetterNodeControl extends HeadlessNodeControl implements DrawableControl {

    constructor(node: Node) {
        super(node);
        this.minWidth = 124; // Smallest possible size for setter nodes
    }

    protected drawTitle(canvas: Canvas2D) {
        canvas
            .font("bold 18px sans-serif")
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText('SET', this.size.x / 2, 22);
    }
}
