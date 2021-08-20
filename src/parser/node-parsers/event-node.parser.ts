import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CustomEventNode } from "../../data/nodes/custom-event.node";
import { EventNode } from "../../data/nodes/event.node";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class EventNodeParser extends NodeParser {

    constructor() {
        super({
            "EventReference": (node: EventNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.eventReference = parser.parse(value);
                node.title = 'Event ' + node.eventReference.memberName.replace('Receive', '');
            },
            "bOverrideFunction": (node: EventNode, value: string) => { node.overrideFunction = (value === "True"); },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        return new HeadedNodeControl(data.node);
    }
}
