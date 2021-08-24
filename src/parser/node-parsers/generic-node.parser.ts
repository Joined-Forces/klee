import { NodeClass } from "../../data/node-class";
import { CommentNodeParser } from "./comment-node.parser";
import { CustomPropertyParser } from "../custom-property.parser";
import { NodeParser } from "../node.parser";
import { Node } from "../../data/nodes/node";
import { ParsingNodeData } from "../parsing-node-data";
import { CallFunctionNodeParser } from "./call-function-node.parser";
import { InputAxisNodeParser } from "./input-axis-node.parser";
import { VariableNodeParser } from "./variable-node.parser";
import { PinPropertyParser } from "../pin-property.parser";
import { CustomProperty } from "../../data/custom-property";
import { NodeControl } from "../../controls/nodes/node.control";
import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { Vector2 } from "../../math/vector2";
import { IfThenElseNodeParser } from "./if-then-else-node.parser";
import { KnotNodeParser } from "./knot-node.parser";
import { CustomEventNodeParser } from "./custom-event-node.parser";
import { EventNodeParser } from "./event-node.parser";
import { InputKeyNodeParser } from "./inputkey-node.parser";


export class GenericNodeParser extends NodeParser {

    private readonly _OBJECT_STARTING_TAG = "Begin Object";

    private _nodeParsers: {
        [key in NodeClass]: () => NodeParser
    } = {
        [NodeClass.COMMENT]: () => new CommentNodeParser(),
        [NodeClass.CALL_FUNCTION]: () => new CallFunctionNodeParser(),
        [NodeClass.VARIABLE_GET]: () => new VariableNodeParser(),
        [NodeClass.VARIABLE_SET]: () => new VariableNodeParser(),
        [NodeClass.EVENT]: () => new EventNodeParser(),
        [NodeClass.CUSTOM_EVENT]: () => new CustomEventNodeParser(),
        [NodeClass.INPUT_AXIS_EVENT]: () => new InputAxisNodeParser(),
        [NodeClass.IF_THEN_ELSE]: () => new IfThenElseNodeParser(),
        [NodeClass.KNOT]: () => new KnotNodeParser(),
        [NodeClass.INPUT_KEY]: () => new InputKeyNodeParser(),
    }

    private readonly _customPropertyParsers: {
        [key: string]: () => CustomPropertyParser
    } = {
        "Pin": () => new PinPropertyParser(),
    }

    constructor() {
        super({
            "NodeGuid": (node: Node, v: string) => { node.guid = v; },
            "NodePosX": (node: Node, v: string) => { node.pos.x = Number.parseInt(v); },
            "NodePosY": (node: Node, v: string) => { node.pos.y = Number.parseInt(v); }
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const headerLine = data.lines[0];
        const header = this.parseHeader(headerLine);

        data.node = {
            class: header.class,
            name: header.name,
            title: header.name,
            subTitles: [],
            guid: undefined,
            pos: new Vector2(0, 0),
            sourceText: data.lines.join('\n'),
            customProperties: []
        }


        this.parseProperties(data);

        this.parseCustomProperties(data);

        const particularImplementation = this._nodeParsers[data.node.class];
        if(!particularImplementation) {
            console.info(`There is no particular implementation for class ${data.node.class}. Falling back to the generic node class.`);
            return new HeadedNodeControl(data.node);
        }

        const parser: NodeParser = particularImplementation();
        return parser.parse(data);
    }

    private parseHeader(headerLine: string) {

        let options: any = {};

        const parseArgument = (argumentTerm: string) => {
            const keyValuePair = argumentTerm.split("=");
            options[keyValuePair[0]] = keyValuePair[1].replace(/"/g, '');
        }

        const prefixLength = this._OBJECT_STARTING_TAG.length;
        const headerWithoutStartingTag = headerLine.substr(prefixLength, headerLine.length - prefixLength - 1);
        const headerArguments = headerWithoutStartingTag.trim().split(' ') || [];

        headerArguments.forEach(a => parseArgument(a));

        return {
            class: options.Class,
            name: options.Name
        }
    }

    private parseCustomProperties(data: ParsingNodeData): void {
        for (const line of data.unparsedLines) {
            if (line.startsWith('CustomProperties')) {
                data.node.customProperties.push(this.parseCustomProperty(line));
            }
        }
    }

    private parseCustomProperty(propertyLine: string): CustomProperty {

        // Removes "CustomProperties" from property line
        propertyLine = propertyLine.substr("CustomProperties".length).trim();

        let dataset = propertyLine.split(' ');
        let type = dataset.shift();
        let data = dataset.join(' ');

        data = data.trim();
        data = data.substr(1, data.length - 2);

        const propertyParser = this._customPropertyParsers[type]();
        const customProperty = propertyParser.parse(data);

        return customProperty;
    }
}
