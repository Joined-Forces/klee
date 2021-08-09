import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { MathFunctionNode } from "../../data/nodes/math-function.node";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class MathFunctionNodeParser extends NodeParser {

    private readonly MATH_FUNCTIONS = [
        'Multiply',
        'Divide',
        'Add',
        'Subtract',
        'Percent',
        'FMax', 'Max',
        'FMin', 'Min',
        'Dot',
        'Less',
        'LessEqual',
        'Greater',
        'GreaterEqual',
        'Abs',
        'Exp',
        'Sqrt',
        'Square',
        'Not',
        'NotEqual',
        'EqualEqual',
        'BooleanOR',
        'BooleanXOR',
        'BooleanNOR',
        'BooleanAND',
        'BooleanNAND',
    ];

    public parse(data: ParsingNodeData): NodeControl {
        const node = data.node as MathFunctionNode;
        node.isPrimitiveNode = (this.MATH_FUNCTIONS.filter(f => node.functionReference.memberName.startsWith(f)).length > 0);
        if(node.isPrimitiveNode) {
            return new HeadlessNodeControl(node);
        }
        return new HeadedNodeControl(node);
    }
}


// if (this.node.isMathFunction) {
//     let functionName = (this.node as CallFunctionNodeObject).functionReference.memberName;
//     let operator = '';

//     if (functionName.startsWith("Multiply"))
//         operator = '×';
//     if (functionName.startsWith("Divide"))
//         operator = '÷';

//         canvas.fillStyle(this.fillStyleText)
//             .textAlign('center')
//             .font('24px sans-serif')
//             .fillText(operator, this.width * .5, this.height * .5 + 9);

// } else {

// }
