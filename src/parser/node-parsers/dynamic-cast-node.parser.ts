import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { DynamicCastNode } from "../../data/nodes/dynamic-cast.node";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class DynamicCastNodeParser extends NodeParser {

    constructor() {
        super({
            "TargetType": (node: DynamicCastNode, value: string) => {
                node.targetType = NodeDataReferenceParser.parseClassReference(value);
            }
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        let castNode = (data.node as DynamicCastNode);
        castNode.title = "Cast to " + castNode.targetType.className;
        castNode.backgroundColor = "32, 116, 120";
        

        return new HeadedNodeControl(data.node, IconLibrary.CAST);
    }
}
