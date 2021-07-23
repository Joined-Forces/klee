export class BlueprintParserUtils {

    static parseString(value: string): string {
        value = value.replace(/(?<!\\)["']/g, '');
        return value;
    }

    static stripLine(text: string): string {
        text = text.replace('\t', '');
        return text.trim();
    }
}
