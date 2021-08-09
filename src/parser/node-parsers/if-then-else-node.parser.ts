import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class IfThenElseNodeParser extends NodeParser {

    public parse(data: ParsingNodeData): NodeControl {
        data.node.title = "Branch";
        return new HeadedNodeControl(data.node);
    }
}
