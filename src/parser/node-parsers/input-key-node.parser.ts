import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { InputKeyNode } from "../../data/nodes/input-key.node";
import { prettifyText } from "../../utils/text-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class InputKeyNodeParser extends NodeParser {

    private static readonly DEFAULT_BACKGROUND_COLOR = '156, 36, 35';

    constructor() {
        super({
            "InputKey": (node: InputKeyNode, value: string) => { node.inputKey = value; },
            "bControl": (node: InputKeyNode, value: string) => { node.control = value.toLowerCase() === "true"; },
            "bAlt": (node: InputKeyNode, value: string) => { node.alt = value.toLowerCase() === "true"; },
            "bShift": (node: InputKeyNode, value: string) => { node.shift = value.toLowerCase() === "true"; },
            "bCommand": (node: InputKeyNode, value: string) => { node.command = value.toLowerCase() === "true"; },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        data.node.backgroundColor = InputKeyNodeParser.DEFAULT_BACKGROUND_COLOR;

        let inputKeyNode = data.node as InputKeyNode;

        let modifiers = [];
        let title = "";

        if (inputKeyNode.control)
            modifiers.push("Ctrl");
        if (inputKeyNode.command)
            modifiers.push("Cmd");
        if (inputKeyNode.alt)
            modifiers.push("Alt");
        if (inputKeyNode.shift)
            modifiers.push("Shift");

        if (modifiers.length > 0) {
            title = modifiers.join('+') + " ";
        }

        title += prettifyText(inputKeyNode.inputKey);
        title = title.replace("Magic Leap", "ML");
        
        let icon = IconLibrary.INPUT_KEY;
        if (inputKeyNode.inputKey.startsWith("Gamepad_") || inputKeyNode.inputKey.startsWith("MagicLeap_")) {
            icon = IconLibrary.INPUT_GAMEPAD;
        }

        data.node.title = title;
        return new HeadedNodeControl(data.node, icon);
    }
}
