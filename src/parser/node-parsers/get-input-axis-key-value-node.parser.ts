import { Constants } from "../../constants";
import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { EventNode } from "../../data/nodes/event.node";
import { InputAxisKeyValueNode } from "../../data/nodes/input-axis-key-value";
import { insertSpacesBetweenCapitalizedWords } from "../../utils/text-utils";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class GetInputAxisKeyValueNodeParser extends NodeParser {

    constructor() {
        super({
            "InputAxisKey": (node: InputAxisKeyValueNode, value: string) => { node.inputAxisKey = value; },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        data.node.backgroundColor = Constants.DEFAULT_FUNC_PURE_BACKGROUND_COLOR;
        
        let inputNode = data.node as InputAxisKeyValueNode;
        inputNode.title = "Get " + insertSpacesBetweenCapitalizedWords(inputNode.inputAxisKey);

        let icon = IconLibrary.FUNCTION;
        if (inputNode.inputAxisKey.startsWith("Mouse")) {
            icon = IconLibrary.MOUSE;
        }


        return new HeadedNodeControl(data.node, icon);
    }
}
