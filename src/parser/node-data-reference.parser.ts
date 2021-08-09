import { NodeDataReference } from "../data/node-data-reference";
import { BlueprintParserUtils } from "./blueprint-parser-utils";


export class NodeDataReferenceParser {

    private readonly FUNCTION_NAMES = {
        "K2_GetComponentRotation": "GetWorldRotation",
        "GreaterGreater_VectorRotator": "RotateVector"
    }

    parse(referenceString: string): NodeDataReference {
        referenceString = referenceString.trim();
        referenceString = referenceString.substr(1, referenceString.length - 2);

        let dataRef: NodeDataReference = {};

        const data = referenceString.split(',');

        for (let i = 0; i < data.length; ++i) {
            let dataSet = data[i].split('=');

            let key = dataSet[0];
            let value = dataSet[1];

            switch(key) {
                case "MemberName": dataRef.memberName = this.translateFunctionName(BlueprintParserUtils.parseString(value)); break;
                case "MemberParent":
                    if (value.startsWith('Class')) {
                        value = value.replace('Class', '');
                        value = value.replace(/'/g, '').replace(/"/g, '');
                        dataRef.memberParent = value;
                    } else {
                        dataRef.memberParent = value;
                    }
                    break;
                case "MemberGuid": dataRef.memberGUID = value; break;
                case "bSelfContext": dataRef.selfContext = value == "True"; break;
            }
        }

        return dataRef;
    }

    private translateFunctionName(value: string) {
        for (let key in this.FUNCTION_NAMES) {
            let name = this.FUNCTION_NAMES[key]

            value = value.replace(key, name);
        }

        return value;
    }
}
