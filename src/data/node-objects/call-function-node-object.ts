import { NodeClass } from "../node-class";
import { NodeDataReference } from "../node-data-reference";
import { NodeObject } from "../node-object";

export class CallFunctionNodeObject extends NodeObject {

    private static readonly MATH_FUNCTIONS = ['Multiply_VectorFloat'];

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
        return CallFunctionNodeObject.MATH_FUNCTIONS.indexOf(memberName) >= 0;
    }
}
