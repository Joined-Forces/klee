import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { MathFunctionNode } from "../../data/nodes/math-function.node";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export interface StringFunction {
    name: string;
    displayName: string;
    isPrimitive?: boolean;
}

export class StringFunctionNodeParser extends NodeParser {

    private static readonly STR_FUNCTIONS: Array<StringFunction> = [
        { name: 'Concat_StrStr', displayName: 'Append', },
        { name: 'Conv_', displayName: '·', isPrimitive: true },
    ];

    public parse(data: ParsingNodeData): NodeControl {
        const node = data.node as MathFunctionNode;
        const func = StringFunctionNodeParser.STR_FUNCTIONS.find(f => node.functionReference.memberName.startsWith(f.name));
        if(func) {
            node.title = func.displayName;
        }
        node.subTitles = [];
        if(func?.isPrimitive === true) {
            BlueprintParserUtils.hidePinNames(node.customProperties);
            return new HeadlessNodeControl(node);
        }
        return new HeadedNodeControl(node, IconLibrary.FUNCTION);
    }
}
