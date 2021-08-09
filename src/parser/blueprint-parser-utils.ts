export class BlueprintParserUtils {

    static parseString(value: string): string {
        return value.replace(/(?<!\\)["']/g, '');
    }

    static stripLine(text: string): string {
        return text.replace('\t', '').trim();
    }
}
