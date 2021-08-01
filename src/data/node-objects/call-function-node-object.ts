import { NodeClass } from "../node-class";
import { NodeDataReference } from "../node-data-reference";
import { NodeObject } from "../node-object";

export class CallFunctionNodeObject extends NodeObject {

    private static readonly MATH_FUNCTIONS = [
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

    functionReference: NodeDataReference;

    parseAttribute(name: string, value: string) {
        super.parseAttribute(name, value);

        switch (name) {
            case "FunctionReference":
                this.functionReference = new NodeDataReference();
                this.functionReference.parse(value);
                break;
        }
    }

    getName() {
        return this.functionReference.memberName;
    }

    get isMathFunction(): boolean {
        return <any>this.functionReference.memberParent == NodeClass.KISMET_MATH_LIBRARY
            && this.checkMathFunction(this.functionReference.memberName);
    }

    private checkMathFunction(memberName: string): boolean {
        return CallFunctionNodeObject.MATH_FUNCTIONS.filter(f => memberName.startsWith(f)).length > 0;
    }
}
