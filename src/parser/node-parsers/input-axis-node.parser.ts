import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { InputAxisNode } from "../../data/nodes/input-axis.node";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export class InputAxisNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '156, 36, 35';

    constructor() {
        super({
            "InputAxisName": (node: InputAxisNode, value: string) => {
                node.inputAxisName = value.replace(/"/g, '');
                node.title = "InputAxis " + node.inputAxisName;
            },
            "CustomFunctionName": (node: InputAxisNode, value: string) => { node.customFunctionName = value; },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        data.node.backgroundColor = InputAxisNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node, IconLibrary.EVENT);
    }
}
