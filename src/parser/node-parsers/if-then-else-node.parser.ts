import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class IfThenElseNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '150, 150, 150';

    public parse(data: ParsingNodeData): NodeControl {
        data.node.title = "Branch";
        data.node.backgroundColor = IfThenElseNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node);
    }
}
