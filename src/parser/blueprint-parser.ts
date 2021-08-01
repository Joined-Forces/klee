import { CallFunctionNodeObject } from "../data/node-objects/call-function-node-object";
import { IfThenElseNodeObject } from "../data/node-objects/if-then-else-node-object";
import { InputAxisNodeObject } from "../data/node-objects/input-axis-node-object";
import { KnotNodeObject } from "../data/node-objects/knot-node-object";
import { NodeClass } from "../data/node-class";
import { NodeObject } from "../data/node-object";
import { NodeObjectHeader } from "../data/node-object-header";
import { VariableGetNodeObject } from "../data/node-objects/variable-get-node-object";
import { BlueprintParserUtils } from "./blueprint-parser-utils";
import { CommentNodeObject } from "../data/node-objects/comment-node-object";

export class BlueprintParser {

    private readonly _OBJECT_STARTING_TAG = "Begin Object";
    private readonly _OBJECT_ENDING_TAG = "End Object";

    private _lines: string[];

    private _nodeObjects = {
        [NodeClass.KNOT]: () => new KnotNodeObject(),
        [NodeClass.INPUT_AXIS_EVENT]: () => new InputAxisNodeObject(),
        [NodeClass.CALL_FUNCTION]: () => new CallFunctionNodeObject(),
        [NodeClass.VARIABLE_GET]: () => new VariableGetNodeObject(),
        [NodeClass.IF_THEN_ELSE]: () => new IfThenElseNodeObject(),
        [NodeClass.COMMENT]: () => new CommentNodeObject(),
    }

    constructor() {}

    parseBlueprint(blueprintData: string): Array<NodeObject> {

        let nodes = new Array<NodeObject>();

        this._lines = blueprintData
            .replace(/\r/g, '')
            .split('\n');

        for (let i = 0; i < this._lines.length; ++i) {
            let line = BlueprintParserUtils.stripLine(this._lines[i]);

            if (line.startsWith(this._OBJECT_STARTING_TAG)) {
                const header = this.parseNodeHeader(line);
                const lines = this.getLinesUntilEndTag(i);

                try {
                    const node = this.createNodeObject(header, line, lines);
                    nodes.push(node);
                } catch (error) {
                    console.error(error);
                    throw new Error(`Unable to parse node: ${header.name}`);
                }

                i += lines.length;
            }
        }

        return nodes;
    }

    private createNodeObject(header: NodeObjectHeader, headerLine: string, bodyLines: string[]): NodeObject {

        let node: NodeObject;
        const particularImplementation = this._nodeObjects[header.class];
        if(!particularImplementation) {
            console.warn(`There is no particular implementation for class ${header.class}. Falling back to the generic node class.` );
            node = new NodeObject();
        }
        else {
            node = particularImplementation();
        }

        node.name = header.name;
        node.class = <any>header.class;

        node.parse(headerLine, bodyLines);

        return node;
    }

    private getLinesUntilEndTag(lineNumber: number): string[] {

        let lines = [];
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

    private parseNodeHeader(headerLine: string): NodeObjectHeader {

        let options: any = {};

        const parseArgument = (argumentTerm: string) => {
            const keyValuePair = argumentTerm.split("=");
            options[keyValuePair[0]] = keyValuePair[1].replace(/"/g, '');
        }

        const prefixLength = this._OBJECT_STARTING_TAG.length;
        const headerWithoutStartingTag = headerLine.substr(prefixLength, headerLine.length - prefixLength - 1);
        const headerArguments = headerWithoutStartingTag.trim().split(' ') || [];

        headerArguments.forEach(a => parseArgument(a));

        return new NodeObjectHeader(options.Class, options.Name);
    }
}