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

        this.foldState = (node.advancedPinDisplay !== undefined) ? node.advancedPinDisplay : true;

        this.nodeButton = new NodeFoldButton(this.foldState);
        this.mainPanel.add(this.nodeButton);

        this.nodeButton.onClick = (foldOut) => this.toggleFold(foldOut);
    }

    public toggleFold(foldOut: boolean) {
        this.foldState = foldOut;
        this.applyAdvancedView(this.foldState);

        Application.scene.refresh();
    }

    private applyAdvancedView(advancedView: boolean) {
        for (let pin of this.pins) {
            if (pin.pinProperty.advancedView === true && !pin.pinProperty.isLinked) {
                pin.visible = advancedView;
            }
        }

        this.nodeButton.refreshLayout();
        this.refreshLayout();

        for (let pin of this.pins) { 
            pin.refreshLayout();
        }

    }
}