import { CustomProperty } from "../data/custom-property";
import { PinCategory } from "../data/pin/pin-category";
import { PinDirection } from "../data/pin/pin-direction";
import { PinProperty } from "../data/pin/pin-property";
import { prettifyText } from "../utils/text-utils";
import * as EnumNames from "./enum-names.json";

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
        if(!matches) {
            return value; 
        }
        return matches[0];
    }

    static hidePinNames(customProperties: CustomProperty[]) {
        customProperties.forEach(p => {
            if (p instanceof PinProperty === false) { return false; }
            (p as PinProperty).hideName = true;
        })
    }

    static configureFirstDelegatePinInHead(customProperties: CustomProperty[]): void {
        for (const property of customProperties) {
            if (!(property instanceof PinProperty)) { continue };
            if (property.direction !== PinDirection.EGPD_Output) { continue };
            if (property.category !== PinCategory.delegate) { continue };
            if (property.name !== 'Output Delegate') { continue };

            property.showInHead = true;
            property.hideName = true;
            return;
        }
    }

    static getFirstClassNameFromPinProperties(customProperties: CustomProperty[]) {
        for (const property of customProperties) {
            if (!(property instanceof PinProperty)) { continue };
            if (property.name !== "Class" || property.isLinked) { continue };

            return property.defaultValue || "NONE";
        }
    }

    static parseEnumValue(enumClass: string, value: string) {
        value = value.replace(/["']/g, '');

        let classObj = EnumNames[enumClass];
        if (classObj) {
            let name = classObj[value];
            return name || prettifyText(value);
        }

        return prettifyText(value);
    }
}
