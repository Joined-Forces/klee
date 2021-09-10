import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { IconLibrary } from "../../controls/utils/icon-library";
import { Node } from "../../data/nodes/node";
import { Constants } from "../../constants";


export class TunnelNodeParser extends NodeParser {

    constructor() {
        super({
            "bCanHaveInputs": (node: Node, value: string) => { if (value.toLowerCase() === "true") { node.title = 'Outputs'; }},
            "bCanHaveOutputs": (node: Node, value: string) => { if (value.toLowerCase() === "true") { node.title = 'Inputs'; }},
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        data.node.backgroundColor = Constants.DEFAULT_FUNC_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node, IconLibrary.CONSTRUCT);
    }
}
