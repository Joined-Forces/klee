import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { SetFieldsInStructNode } from "../../data/nodes/set-fields-in-struct.node";
import { NodeDataReferenceParser } from "../node-data-reference.parser";

export class SetFieldsInStructNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '19, 42, 79';

    constructor() {
        super({
            "StructType": (node: SetFieldsInStructNode, value: string) => {
                node.structType = NodeDataReferenceParser.parseClassReference(value);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        
        data.node.backgroundColor = SetFieldsInStructNodeParser._DEFAULT_BACKGROUND_COLOR;
        const structNode = data.node as SetFieldsInStructNode;

        structNode.title = "Set members in " + structNode.structType.className;
        return new HeadedNodeControl(data.node, IconLibrary.PILL);
    }
}
