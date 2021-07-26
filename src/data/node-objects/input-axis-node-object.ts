import { NodeObject } from "../node-object";

export class InputAxisNodeObject extends NodeObject {

    inputAxisName: string;
    //eventReference: string;
    customFunctionName: string;

    parseAttribute(name: string, value: string) {
        super.parseAttribute(name, value);

        switch (name) {
            case "InputAxisName": this.inputAxisName = value.replace(/"/g, ''); break;
            case "CustomFunctionName": this.customFunctionName = value; break;
        }
    }

    getName() {
        return "InputAxis " + this.inputAxisName;
    }
}
