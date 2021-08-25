import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class FlowControlNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '150, 150, 150';

    private static readonly _NODE_TITLES: {
        [key in UnrealNodeClass]?: {
            title: string
            icon?: IconLibrary,
        }
    } = {
        [UnrealNodeClass.IF_THEN_ELSE]: { title: "Branch", icon: IconLibrary.BRANCH },
        [UnrealNodeClass.EXECUTION_SEQUENCE]: { title: "Sequence" },
        [UnrealNodeClass.MULTI_GATE]: { title: "Multi Gate" },
    }

    public parse(data: ParsingNodeData): NodeControl {
        const nodeData = FlowControlNodeParser._NODE_TITLES[data.node.class];
        data.node.title = nodeData.title;
        data.node.backgroundColor = FlowControlNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node, nodeData.icon as string);
    }
}
