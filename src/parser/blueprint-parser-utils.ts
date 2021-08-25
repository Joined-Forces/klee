import { removeInsignificantTrailingZeros } from "../utils/text-utils";

export class BlueprintParserUtils {

    static parseString(value: string): string {
        return value.replace(/(?<!\\)["']/g, '');
    }

    static stripLine(text: string): string {
        return text.replace('\t', '').trim();
    }

    static parseColor(value: string): string {
        value = value.replace(/[()]/g, '');
        let colorData = value.split(',');

        let colorArray = [];
        for (let data of colorData) {
            let keyValue = data.split('=');

            let value = (keyValue[0] != 'A') ? Math.floor(Number.parseFloat(keyValue[1]) * 255) : Number.parseFloat(keyValue[1]);
            colorArray.push(value);
        }

        let colorString = "rgba(" + colorArray.join(',') + ")";

        return colorString;
    }

    static getClassFriendlyName(value: string): string {
        const defaultObject = BlueprintParserUtils.parseString(value);
        const matches = /(?<=\.)((?!_C$)\w)*/g.exec(defaultObject);
        if(!matches[0]) { 
            return value; 
        }
        return matches[0];
    }
}
