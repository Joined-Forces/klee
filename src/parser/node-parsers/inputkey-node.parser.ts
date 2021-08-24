import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { InputKeyNode } from "../../data/nodes/input-key.node";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class InputKeyNodeParser extends NodeParser {

    constructor() {
        super({
            "InputKey": (node: InputKeyNode, value: string) => { node.inputKey = value; },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        return new HeadedNodeControl(data.node);
    }
}
