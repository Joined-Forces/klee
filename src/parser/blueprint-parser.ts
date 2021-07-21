import { NodeControl } from "../controls/node-control";
import { NodeClass } from "../data/node-class";
import { CallFunctionNodeObject, VariableGetNodeObject, IfThenElseNodeObject, InputAxisNodeObject, KnotNodeObject, NodeObject, NodeObjectHeader } from "../data/node-object";

export class BlueprintParser {

    private _nodes: Array<NodeControl>;

    constructor() {
        this._nodes = new Array<NodeControl>();
    }

    parse(blueprintData: string) : Array<NodeObject> {
        return this.parseBlueprint(blueprintData);
    }

    private parseBlueprint(blueprintData: string): Array<NodeObject> {
        let nodes: Array<NodeObject> = [];

        let lines = blueprintData.replace(/\r/g, '').split('\n');
        
        for (let i = 0; i < lines.length; ++i) {
            let line = this.stripLine(lines[i]);

            if (line.startsWith("Begin Object")) {
                let header = this.parseNodeHeader(line);
                let node = this.createNodeObject(header.class);

                node.name = header.name;
                node.class = header.class;
                

                let headerLine = line;
                let objectLines = [];

                while (!line.startsWith("End Object")) {
                    ++i;
                    line = this.stripLine(lines[i]);
                    objectLines.push(line);
                }

                node.parse(objectLines);
                nodes.push(node);
            }
        }

        return nodes;
    }

    private parseNodeHeader(headerLine: string): NodeObjectHeader {
        let header = new NodeObjectHeader();
        let prefixLength = "Begin Object".length - 1;
        let dataString = headerLine.substr(prefixLength, headerLine.length - prefixLength - 1);

        let data = dataString.trim().split(' ');
        for (let i = 0; i < data.length; ++i) {
            let dataset = data[i].split("=");
            let key = dataset[0];
            let value = dataset[1];

            switch (key) {
                case "Class": header.class = value.replace(/"/g, ''); break;
                case "Name": header.name = value.replace(/"/g, ''); break;
            }
        }

        return header;
    }

    private createNodeObject(className: string) {
        switch (className) {
            case NodeClass.KNOT: return new KnotNodeObject();
            case NodeClass.INPUT_AXIS_EVENT: return new InputAxisNodeObject();
            case NodeClass.CALL_FUNCTION: return new CallFunctionNodeObject();
            case NodeClass.VARIABLE_GET: return new VariableGetNodeObject();
            case NodeClass.IF_THEN_ELSE: return new IfThenElseNodeObject();
            default: return new NodeObject();
        }
    }

    private stripLine(text: string) {
        text = text.replace('\t', '');
        return text.trim();
    }
}