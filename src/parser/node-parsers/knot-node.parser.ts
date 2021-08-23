import { NodeControl } from "../../controls/nodes/node.control";
import { RerouteNodeControl } from "../../controls/nodes/reroute-node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class KnotNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '156, 36, 35';

    public parse(data: ParsingNodeData): NodeControl {
        data.node.backgroundColor = KnotNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new RerouteNodeControl(data.node);
    }
}
