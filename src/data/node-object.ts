import { BlueprintParserUtils } from "../parser/blueprint-parser-utils";
import { CustomProperty, PinProperty } from "./custom-property";
import { NodeFunctionNames } from "./function-names";
import { NodeClass } from "./node-class";

export class NodeObjectHeader {

    constructor(cls: string, name: string) {
        this.class = cls;
        this.name = name;
    }

    class: string;
    name: string;
}

export class NodeDataReference {
    memberName: string;
    memberParent: string;
    memberGUID: string;
    selfContext: boolean;

    parse(referenceString: string) {
        referenceString = referenceString.trim();
        referenceString = referenceString.substr(1, referenceString.length - 2);

        let data = referenceString.split(',');

        for (let i = 0; i < data.length; ++i) {
            let dataSet = data[i].split('=');

            let key = dataSet[0];
            let value = dataSet[1];

            switch(key) {
                case "MemberName": this.memberName = NodeFunctionNames.translate(BlueprintParserUtils.parseString(value)); break;
                case "MemberParent": 
                    if (value.startsWith('Class')) {
                        value = value.replace('Class', '');
                        value = value.replace(/'/g, '').replace(/"/g, '');
                        this.memberParent = value;
                    } else {
                        this.memberParent = value; 
                    }
                    break;
                case "MemberGuid": this.memberGUID = value; break;
                case "bSelfContext": this.selfContext = value == "True"; break;
            }
        }
    }
}

export class NodeObject {

    class: string;
    name: string;
    
    nodePosX: number;
    nodePosY: number;
    nodeGUID: string;

    customProperties: Array<CustomProperty>;

    constructor() {
        this.customProperties = new Array<CustomProperty>();
    }

    parse(objectLines: string[]) {
        let line: string;

        for (let i = 0; i < objectLines.length; ++i) {
            line = objectLines[i];

            if (line.startsWith('CustomProperties')) {
                let propertyLine = line.substr("CustomProperties".length).trim();
                this.parseCustomProperty(propertyLine);
                continue;
            }

            let dataset = line.split('=');
            let key = dataset.shift();
            let value = dataset.join('=');

            this.parseAttribute(key, value);
        }
    }

    parseAttribute(name: string, value: string) {
        switch (name) {
            case "NodePosX": this.nodePosX = Number.parseInt(value); break;
            case "NodePosY": this.nodePosY = Number.parseInt(value); break;
            case "NodeGuid": this.nodeGUID = value;
        }
    }

    parseHeader(headerLine: string) {
        let prefixLength = "Begin Object".length - 1;
        let dataString = headerLine.substr(prefixLength, headerLine.length - prefixLength - 1);

        let data = dataString.trim().split(' ');
        for (let i = 0; i < data.length; ++i) {
            let dataset = data[i].split("=");
            let key = dataset[0];
            let value = dataset[1];

            switch (key) {
                case "Class": this.class = value.replace(/"/g, ''); break;
                case "Name": this.name = value.replace(/"/g, ''); break;
            }
        }
    }

    parseCustomProperty(propertyLine: string) {

        let dataset = propertyLine.split(' ');
        let type = dataset.shift();
        let data = dataset.join(' ');

        data = data.trim();
        data = data.substr(1, data.length - 2);

        let property: CustomProperty;

        switch (type) {
            case "Pin": property = new PinProperty(this); break;
            default: return;
        }

        property.parse(data);
        this.customProperties.push(property);
    }

    get isMathFunction(): boolean {
        return false;
    }

    get isRerouteNode(): boolean {
        return this.class === NodeClass.KNOT;
    }

    getName(): string {
        return this.name;
    }
}

export class KnotNodeObject extends NodeObject {

}

export class IfThenElseNodeObject extends NodeObject {

    getName() {
        return "Branch";
    }
}

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
        return this.functionReference.memberParent === NodeClass.KISMET_MATH_LIBRARY
            && this.checkMathFunction(this.functionReference.memberName);
    }

    private checkMathFunction(memberName: string): boolean {
        return CallFunctionNodeObject.MATH_FUNCTIONS.indexOf(memberName) >= 0;
    }
}

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