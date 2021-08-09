import { NodeControl } from "../../controls/nodes/node.control";
import { RerouteNodeControl } from "../../controls/nodes/reroute-node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class KnotNodeParser extends NodeParser {
    public parse(data: ParsingNodeData): NodeControl {
        return new RerouteNodeControl(data.node);
    }
}
