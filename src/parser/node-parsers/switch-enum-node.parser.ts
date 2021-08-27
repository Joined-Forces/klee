import { FoldableHeadedNodeControl } from "../../controls/nodes/foldable-headed-node.control";
import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { DynamicCastNode } from "../../data/nodes/dynamic-cast.node";
import { SwitchEnumNode } from "../../data/nodes/switch-enum.node";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class SwitchEnumNodeParser extends NodeParser {

    constructor() {
        super({
            "Enum": (node: SwitchEnumNode, value: string) => { node.enum = BlueprintParserUtils.parseString(value); },
            "EnumEntries": (node: SwitchEnumNode, value: string) => {
                if (!node.enumEntries)
                    node.enumEntries = [];

                node.enumEntries.push(BlueprintParserUtils.parseString(value));
            },
            "AdvancedPinDisplay": (node: SwitchEnumNode, value: string) => {
                node.advancedPinDisplay = value === "Shown" ? true : false;
            }
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        let switchNode = (data.node as SwitchEnumNode);
        switchNode.title = "Switch on " + BlueprintParserUtils.getClassFriendlyName(switchNode.enum);
        switchNode.backgroundColor = "162, 161, 35";
        
        return new FoldableHeadedNodeControl(data.node);
    }
}
