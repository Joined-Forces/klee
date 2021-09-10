import { Canvas2D } from "../../canvas";
import { DrawableControl } from "../interfaces/drawable";
import { Constants } from "../../constants";
import { HeadlessNodeControl } from "./headless-node-control";


export class SetterNodeControl extends HeadlessNodeControl implements DrawableControl {

    protected drawTitle(canvas: Canvas2D) {
        if(!this.node.title) { return; }

        canvas
            .font("bold 18px sans-serif")
            .textAlign('center')
            .fillStyle(Constants.NODE_MATHFUNC_TITLE_COLOR)
            .fillText(this.node.title, this.size.x / 2, 22);
    }
}
