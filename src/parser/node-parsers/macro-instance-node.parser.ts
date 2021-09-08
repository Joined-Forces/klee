import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { MacroGraphReferenceParser } from "../macro-graph-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { Node } from "../../data/nodes/node";
import { insertSpacesBetweenCapitalizedWords } from "../../utils/text-utils";
import { MacroInstanceNode } from "../../data/nodes/macro-instance.node";

export class MacroInstanceNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '150, 150, 150';

    constructor() {
        super({
            "MacroGraphReference": (node: MacroInstanceNode, value: string) => {
                const parser = new MacroGraphReferenceParser();
                node.macroGraphReference = parser.parse(value);
                node.title = insertSpacesBetweenCapitalizedWords(node.macroGraphReference.macroFuncName);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        const macroNode = data.node as MacroInstanceNode;

        const icon = MacroInstanceNodeParser.getIconForMacro(macroNode.macroGraphReference.macroFuncName);
        data.node.backgroundColor = MacroInstanceNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node, icon);
    }

    private static getIconForMacro(macroFuncName: string): string {
        switch (macroFuncName) {
            case 'ForLoop': return IconLibrary.LOOP;
            case 'ForLoopWithBreak': return IconLibrary.LOOP;
            case 'WhileLoop': return IconLibrary.LOOP;
            case 'Gate': return IconLibrary.GATE;
            case 'FlipFlop': return IconLibrary.FLIPFLOP;
            case 'Do': return IconLibrary.DO_N;
            case 'DoOnce': return IconLibrary.DO_ONCE;
            default: return undefined;
        }
    }
}
