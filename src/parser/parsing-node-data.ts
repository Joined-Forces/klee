import { Node } from '../data/nodes/node';

export class ParsingNodeData {

    private _node: Node;
    private _lines: string[];
    private _unparsedLines: string[];

    constructor(lines: string[]) {
        this._lines = Array.from(lines);
        this._unparsedLines = lines.slice(1, lines.length - 1);
    }

    public get node(): Node {
        return this._node;
    }

    public set node(value: Node) {
        this._node = value;
    }

    public get lines(): string[] {
        return this._lines;
    }

    public get unparsedLines(): string[] {
        return this._unparsedLines;
    }
}
