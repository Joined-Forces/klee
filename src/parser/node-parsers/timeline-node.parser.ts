import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { Node } from "../../data/nodes/node";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class TimelineNodeParser extends NodeParser {

    private static readonly DEFAULT_BACKGROUND_COLOR = '138, 108, 19';

    constructor() {
        super({
            "TimelineName": (node: Node, value: string) => { node.title = BlueprintParserUtils.parseString(value); },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        data.node.backgroundColor = TimelineNodeParser.DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node); // TODO: Add icon here
    }
}
