import { ParsingNodeData } from "./parsing-node-data";
import { Node } from '../data/nodes/node';
import { NodeControl } from "../controls/nodes/node.control";

export abstract class NodeParser {

    protected _propertyParsers: {
        [key: string]: (node: Node, value: string) => void
    } = {}

    constructor(properties?) {
        this._propertyParsers = properties;
    }

    public parse(data: ParsingNodeData): NodeControl {
        throw new Error("Not implemented! A derived class does not override the 'parse' function of the abstract class 'NodeParser'.");
    }

    protected parseProperties(data: ParsingNodeData): void {
        for (let i = data.unparsedLines.length - 1; i >= 0; i--) {
            const line = data.unparsedLines[i];
            if(this.parseProperty(data.node, line)) {
                data.unparsedLines.splice(i, 1);
            }
        }
    }

    protected parseProperty(node: Node, line: string): boolean {
        const dataset = line.split('=');
        const key = dataset.shift();
        const value = dataset.join('=');

        const propertyParser = this._propertyParsers[key];
        if (!propertyParser) return false;

        propertyParser(node, value);
        return true;
    }
}
