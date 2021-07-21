export class BlueprintParserUtils {

    static parseString(value: string): string {
        value = value.replace(/(?<!\\)["']/g, '');
        return value;
    }

}