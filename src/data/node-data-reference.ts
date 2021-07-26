import { BlueprintParserUtils } from "../parser/blueprint-parser-utils";
import { NodeFunctionNames } from "./function-names";

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
