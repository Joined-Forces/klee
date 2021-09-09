import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { StructNode } from "../../data/nodes/struct.node";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";

export class StructNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '19, 42, 79';

    constructor() {
        super({
            "StructType": (node: StructNode, value: string) => {
                node.structType = NodeDataReferenceParser.parseClassReference(value);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        
        data.node.backgroundColor = StructNodeParser._DEFAULT_BACKGROUND_COLOR;
        const structNode = data.node as StructNode;

        let title = "";
        let icon = IconLibrary.PILL;
        console.log(data.node.class);
        switch (data.node.class) {
            case UnrealNodeClass.SET_FIELDS_IN_STRUCT:
                title = "Set members in ";
                break;
            case UnrealNodeClass.BREAK_STRUCT:
                title = "Break ";
                icon = IconLibrary.BREAK_STRUCT;
                break;
            case UnrealNodeClass.MAKE_STRUCT:
                title = "Make ";
                icon = IconLibrary.MAKE_STRUCT;
                break;
        }

        structNode.title = title + structNode.structType.className;
        return new HeadedNodeControl(data.node, icon);
    }
}
