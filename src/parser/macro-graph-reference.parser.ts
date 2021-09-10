import { MacroGraphReference } from "../data/macro-graph-reference";
import { BlueprintParserUtils } from "./blueprint-parser-utils";


export class MacroGraphReferenceParser {

    parse(referenceString: string): MacroGraphReference {
        referenceString = referenceString.trim();
        referenceString = referenceString.substr(1, referenceString.length - 2);

        let dataRef: MacroGraphReference = {};

        const data = referenceString.split(',');

        for (let i = 0; i < data.length; ++i) {
            let dataSet = data[i].split('=');

            let key = dataSet[0];
            let value = dataSet[1];

            switch(key) {
                case "MacroGraph":
                    dataRef.macroFuncName = MacroGraphReferenceParser.extractNodeNameOfMacroGraphStr(
                        value.substring(value.indexOf("'"))
                    );
                    break;
                case "GraphBlueprint":
                    break;
                case "GraphGuid":
                    break;
            }
        }

        return dataRef;
    }

    private static extractNodeNameOfMacroGraphStr(value: string): string {
        const stringWithoutQuotes = BlueprintParserUtils.parseString(value);
        const matches = /(?<=\:)\w*/g.exec(stringWithoutQuotes);
        if(!matches) {
            return stringWithoutQuotes; 
        }
        return matches[0];
    }
}
