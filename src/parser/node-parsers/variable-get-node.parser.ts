import { NodeControl } from "../../controls/nodes/node.control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { VariableGetNode } from "../../data/nodes/variable-get.node";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { PinProperty } from "../../data/pin/pin-property";


export class VariableGetNodeParser extends NodeParser {

    constructor() {
        super({
            "VariableReference": (node: VariableGetNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.variableReference = parser.parse(value);
                node.title = node.variableReference.memberName;
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        this.removeSelftargetingPins(data.node as VariableGetNode);

        return new HeadlessNodeControl(data.node);
    }

    private removeSelftargetingPins(node: VariableGetNode) {
        for (let i = node.customProperties.length - 1; i >= 0; i--) {
            if (node.customProperties[i] instanceof PinProperty === false) continue;

            const pinProperty = node.customProperties[i] as PinProperty;
            if(pinProperty.name === "self" && node.variableReference.selfContext) {
                node.customProperties.splice(i, 1);
            }
        }
    }
}
