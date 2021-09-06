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
    //description: string;
}

export class MathFunctionNodeParser extends NodeParser {

    private static readonly MATH_FUNCTIONS: Array<MathFunction> = [
        { name: 'Multiply', displayName: '×', },
        { name: 'Divide', displayName: '÷', },
        { name: 'Add', displayName: '-', },
        { name: 'Subtract', displayName: '+', },
        { name: 'Percent', displayName: '%', },
        { name: 'FMax', displayName: 'MAX', },
        { name: 'Max', displayName: 'MAX', },
        { name: 'FMin', displayName: 'MIN', },
        { name: 'Min', displayName: 'MIN', },
        { name: 'Dot', displayName: '⋅', },
        { name: 'LessEqual', displayName: '<=', },
        { name: 'Less', displayName: '<', },
        { name: 'GreaterEqual', displayName: '>=', },
        { name: 'Greater', displayName: '>', },
        { name: 'Abs', displayName: 'ABS', },
        { name: 'Exp', displayName: 'e', },
        { name: 'Sqrt', displayName: 'SQRT', },
        { name: 'Square', displayName: '^2', },
        { name: 'NotEqual', displayName: '!=', },
        { name: 'Not', displayName: 'NOT', },
        { name: 'EqualEqual', displayName: '==', },
        { name: 'BooleanOR', displayName: 'OR', },
        { name: 'BooleanXOR', displayName: 'XOR', },
        { name: 'BooleanNOR', displayName: 'NOR', },
        { name: 'BooleanAND', displayName: 'AND', },
        { name: 'BooleanNAND', displayName: 'NAND', },
    ];

    public parse(data: ParsingNodeData): NodeControl {
        const node = data.node as MathFunctionNode;
        const mathFunc = MathFunctionNodeParser.MATH_FUNCTIONS.find(f => node.functionReference.memberName.startsWith(f.name));
        node.subTitles = [];
        node.isPrimitiveNode = !!mathFunc;
        if(node.isPrimitiveNode) {
            node.title = mathFunc.displayName;
            node.customProperties.forEach(p => {
                if (p instanceof PinProperty === false) { return false; }
                (p as PinProperty).hideName = true;
            })
            return new HeadlessNodeControl(node);
        }
        return new HeadedNodeControl(node, this.getIconForHeadedNode(node));
    }

    private getIconForHeadedNode(node: MathFunctionNode): string {
        if (node.functionReference.memberName.startsWith("Make")) {
            return IconLibrary.MAKE_STRUCT;
        }
        if (node.functionReference.memberName.startsWith("Break")) {
            return IconLibrary.BREAK_STRUCT;
        }

        return IconLibrary.FUNCTION;
    }
}
