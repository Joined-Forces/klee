import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { MathFunctionNode } from "../../data/nodes/math-function.node";
import { PinDirection } from "../../data/pin/pin-direction";
import { PinProperty } from "../../data/pin/pin-property";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export interface MathFunction {
    name: string;
    displayName: string;
    isPrimitive?: boolean;
    //description: string;
}

export class StringFunctionNodeParser extends NodeParser {

    private static readonly STR_FUNCTIONS: Array<MathFunction> = [
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
            node.customProperties.forEach(p => {
                if (p instanceof PinProperty === false) { return false; }
                (p as PinProperty).hideName = true;
            })
            return new HeadlessNodeControl(node);
        }
        return new HeadedNodeControl(node, IconLibrary.FUNCTION);
    }
}
