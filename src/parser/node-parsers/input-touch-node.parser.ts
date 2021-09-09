import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { InputAxisNode } from "../../data/nodes/input-axis.node";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class InputTouchNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '156, 36, 35';

    public parse(data: ParsingNodeData): NodeControl {
        data.node.title = "Input Touch";
        data.node.backgroundColor = InputTouchNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node, IconLibrary.INPUT_TOUCH);
    }
}
