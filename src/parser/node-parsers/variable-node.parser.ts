import { NodeControl } from "../../controls/nodes/node.control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { VariableNode, VariableType } from "../../data/nodes/variable.node";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { PinProperty } from "../../data/pin/pin-property";
import { PinDirection } from "../../data/pin/pin-direction";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { SetterNodeControl } from "../../controls/nodes/setter-node-control";


export class VariableNodeParser extends NodeParser {

    constructor() {
        super({
            "VariableReference": (node: VariableNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.variableReference = parser.parse(value);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        const variableNode = data.node as VariableNode;
        const isSetter = data.node.class === UnrealNodeClass.VARIABLE_SET;

        variableNode.variableType = VariableType.Getter;

        if(isSetter) {
            variableNode.variableType = VariableType.Setter;
            data.node.title = "SET";
            this.hideOutputPinNames(variableNode);
            return new SetterNodeControl(data.node);
        } else {
            data.node.title = undefined;
        }
        return new HeadlessNodeControl(data.node);
    }

    private hideOutputPinNames(node: VariableNode) {
        for (let i = node.customProperties.length - 1; i >= 0; i--) {
            if (node.customProperties[i] instanceof PinProperty === false) continue;

            const pinProperty = node.customProperties[i] as PinProperty;

            if(pinProperty.direction === PinDirection.EGPD_Output) {
                pinProperty.hideName = true;
            }
        }
    }
}
