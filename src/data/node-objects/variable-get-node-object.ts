import { NodeDataReference } from "../node-data-reference";
import { NodeObject } from "../node-object";

export class VariableGetNodeObject extends NodeObject {

    variableReference: NodeDataReference;

    parseAttribute(name: string, value: string) {
        super.parseAttribute(name, value);

        switch (name) {
            case "VariableReference":
                this.variableReference = new NodeDataReference();
                this.variableReference.parse(value);
                break;
        }
    }

    getName() {
        return this.variableReference.memberName;
    }
}
