import { Application } from "../../application";
import { Canvas2D } from "../../canvas";
import { Constants } from "../../constants";
import { Node } from "../../data/nodes/node";
import { Vector2 } from "../../math/vector2";
import { DrawableControl } from "../interfaces/drawable";
import { NodeFoldButton } from "../node-fold-button";
import { HeadedNodeControl } from "./headed-node-control";

export class FoldableHeadedNodeControl extends HeadedNodeControl implements DrawableControl {

    nodeButton: NodeFoldButton;
    foldState: boolean = false;

    constructor(node: Node, icon?: string) {
        super(node, icon);
        console.log(node.advancedPinDisplay);
        this.foldState = (node.advancedPinDisplay !== undefined) ? node.advancedPinDisplay : true;

        if (this.foldState == false) {
            this.recalculateSize(new Vector2(0, this._headerHeight), !this.foldState);
        }

        this.height = this.height + 20;

        this.nodeButton = new NodeFoldButton(this);
        Application.scene.controls.push(this.nodeButton);
    }

    public toggleFold() {
        this.foldState = !this.foldState;
        this.recalculateSize(new Vector2(0, this._headerHeight), !this.foldState);
        this.height = this.height + 20;

        this.nodeButton.updatePosition();

        Application.scene.refresh();
    }
}