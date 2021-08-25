import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CallFunctionNode } from "../../data/nodes/call-function.node";
import { PinProperty } from "../../data/pin/pin-property";
import { MathFunctionNodeParser } from "./math-function-node.parser";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { insertSpacesBetweenCapitalizedWords } from "../../utils/text-utils";
import { IconLibrary } from "../../controls/utils/icon-library";


export class CallFunctionNodeParser extends NodeParser {

    private static readonly _KISMET_MATH_LIBRARY = "/Script/Engine.KismetMathLibrary";
    private static readonly _DEFAULT_FUNC_BACKGROUND_COLOR = '78, 117, 142';
    private static readonly _DEFAULT_PURE_FUNC_BACKGROUND_COLOR = '95, 160, 90';


    constructor() {
        super({
            "bIsPureFunc": (node: CallFunctionNode, value: string) => { node.isPureFunc = (value === "True"); },
            "bIsConstFunc": (node: CallFunctionNode, value: string) => { node.isConstFunc = (value === "True"); },
            "FunctionReference": (node: CallFunctionNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.functionReference = parser.parse(value);
                node.title = insertSpacesBetweenCapitalizedWords(node.functionReference.memberName);
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const node = data.node as CallFunctionNode;

        this.parseProperties(data);

        this.removeSelftargetingPins(node);

        node.backgroundColor = node.isPureFunc === true ? CallFunctionNodeParser._DEFAULT_PURE_FUNC_BACKGROUND_COLOR : CallFunctionNodeParser._DEFAULT_FUNC_BACKGROUND_COLOR;

        if (node.functionReference.memberParent === CallFunctionNodeParser._KISMET_MATH_LIBRARY) {
            return new MathFunctionNodeParser().parse(data);
        }

        return new HeadedNodeControl(node, IconLibrary.FUNCTION);
    }

    private removeSelftargetingPins(node: CallFunctionNode) {
        for (let i = node.customProperties.length - 1; i >= 0; i--) {
            if (node.customProperties[i] instanceof PinProperty === false) continue;

            const pinProperty = node.customProperties[i] as PinProperty;
            // if(pinProperty.name === "self" && !pinProperty.isLinked) {
            //     node.customProperties.splice(i, 1);
            // }
            if(pinProperty.hidden) {
                node.customProperties.splice(i, 1);
            }
        }
    }
}
