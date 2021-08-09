import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CallFunctionNode } from "../../data/nodes/call-function.node";
import { PinProperty } from "../../data/pin/pin-property";
import { MathFunctionNodeParser } from "./math-function-node.parser";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class CallFunctionNodeParser extends NodeParser {

    private readonly _KISMET_MATH_LIBRARY = "/Script/Engine.KismetMathLibrary";

    constructor() {
        super({
            "FunctionReference": (node: CallFunctionNode, v: string) => {
                const parser = new NodeDataReferenceParser();
                node.functionReference = parser.parse(v);
                node.title = node.functionReference.memberName;
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const node = data.node as CallFunctionNode;

        this.parseProperties(data);

        this.removeSelftargetingPins(node);

        if (node.functionReference.memberParent === this._KISMET_MATH_LIBRARY) {
            return new MathFunctionNodeParser().parse(data);
        }

        return new HeadedNodeControl(node);
    }

    private removeSelftargetingPins(node: CallFunctionNode) {
        for (let i = node.customProperties.length - 1; i >= 0; i--) {
            if (node.customProperties[i] instanceof PinProperty === false) continue;

            const pinProperty = node.customProperties[i] as PinProperty;
            if(pinProperty.name === "self" && !pinProperty.isLinked) {
                node.customProperties.splice(i, 1);
            }
        }
    }
}
