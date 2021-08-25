import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { MacroGraphReferenceParser } from "../macro-graph-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { Node } from "../../data/nodes/node";
import { insertSpacesBetweenCapitalizedWords } from "../../utils/text-utils";

export class MacroInstanceNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '150, 150, 150';

    constructor() {
        super({
            "MacroGraphReference": (node: Node, value: string) => {
                const parser = new MacroGraphReferenceParser();
                node.title = insertSpacesBetweenCapitalizedWords(parser.parse(value).macroFuncName);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        data.node.backgroundColor = MacroInstanceNodeParser._DEFAULT_BACKGROUND_COLOR;
        return new HeadedNodeControl(data.node);
    }
}
