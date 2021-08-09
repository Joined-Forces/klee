import { NodeControl } from "../controls/nodes/node.control";
import { BlueprintParserUtils } from "./blueprint-parser-utils";
import { GenericNodeParser } from "./node-parsers/generic-node.parser";
import { ParsingNodeData } from "./parsing-node-data";

export class BlueprintParser {

    private readonly _OBJECT_STARTING_TAG = "Begin Object";
    private readonly _OBJECT_ENDING_TAG = "End Object";

    private _lines: string[];

    constructor() {}

    parseBlueprint(blueprintData: string): Array<NodeControl> {

        let controls = new Array<NodeControl>();

        this._lines = blueprintData
            .replace(/\r/g, '')
            .split('\n');

        for (let i = 0; i < this._lines.length; ++i) {
            let line = BlueprintParserUtils.stripLine(this._lines[i]);
            if (line.startsWith(this._OBJECT_STARTING_TAG)) {
                const lines = this.getLinesUntilEndTag(i);
                i += lines.length;

                lines.unshift(line);

                controls.push(new GenericNodeParser().parse(new ParsingNodeData(lines)));
            }
        }

        return controls;
    }

    private getLinesUntilEndTag(lineNumber: number): string[] {

        let lines = Array<string>();
        let line = "";

        do {
            lineNumber++;

            if(lineNumber >= this._lines.length) {
                throw new Error("Invalid blueprint text. An 'Object' node was never closed. Missing 'End Object'");
            }

            line = BlueprintParserUtils.stripLine(this._lines[lineNumber]);

            if(line.startsWith(this._OBJECT_STARTING_TAG)) {
                throw new Error("Invalid blueprint text. An 'Object' node was opened before the previous was closed. Missing 'End Object'");
            }

            lines.push(line);

        } while (!line.startsWith(this._OBJECT_ENDING_TAG));

        return lines;
    }
}
