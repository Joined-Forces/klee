import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CallFunctionNode } from "../../data/nodes/call-function.node";
import { PinProperty } from "../../data/pin/pin-property";
import { MathFunctionNodeParser } from "./math-function-node.parser";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { insertSpacesBetweenCapitalizedWords, prettifyText } from "../../utils/text-utils";
import { IconLibrary } from "../../controls/utils/icon-library";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";
import { FoldableHeadedNodeControl } from "../../controls/nodes/foldable-headed-node.control";
import { StringFunctionNodeParser } from "./string-function-node.parser";


export class CallFunctionNodeParser extends NodeParser {

    //private static readonly _KISMET_MATH_LIBRARY = "/Script/Engine.KismetMathLibrary";
    //private static readonly _KISMET_STRING_LIBRARY = "/Script/Engine.KismetStringLibrary";
    private static readonly _DEFAULT_FUNC_BACKGROUND_COLOR = '78, 117, 142';
    private static readonly _DEFAULT_PURE_FUNC_BACKGROUND_COLOR = '95, 160, 90';
    private static readonly _DEFAULT_FUNC_ENTRY_BACKGROUND_COLOR = '109, 19, 132';

    private static readonly _FUNCTION_MAP = {
        "/Script/Engine.KismetMathLibrary": (d) => new MathFunctionNodeParser().parse(d),
        "/Script/Engine.KismetStringLibrary": (d) => new StringFunctionNodeParser().parse(d)
    }


    constructor() {
        super({
            "bIsPureFunc": (node: CallFunctionNode, value: string) => { node.isPureFunc = (value === "True"); },
            "bIsConstFunc": (node: CallFunctionNode, value: string) => { node.isConstFunc = (value === "True"); },
            "FunctionReference": (node: CallFunctionNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.functionReference = parser.parse(value);

                node.title = insertSpacesBetweenCapitalizedWords(node.functionReference.memberName);

                if(node.functionReference.selfContext === true) {
                    node.subTitles.push({ text: `Target is self context`});
                } else if(node.functionReference?.memberParent?.className) { // && node.functionReference?.memberParent?.type !== 'Class'

                    // Get self pin
                    const selfPin = node.customProperties.find(p => {
                        return (<PinProperty>p)?.name?.toLowerCase() === 'self';
                    }) as PinProperty;

                    // Only show the target information if the self pin isn't hidden.
                    if (selfPin && !selfPin.hidden) {
                        const formattedClassName = prettifyText(node.functionReference?.memberParent?.className);
                        node.subTitles.push({ text: `Target is ${formattedClassName}`});
                    }
                }
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const node = data.node as CallFunctionNode;

        this.parseProperties(data);

        node.backgroundColor = node.isPureFunc === true ? CallFunctionNodeParser._DEFAULT_PURE_FUNC_BACKGROUND_COLOR : CallFunctionNodeParser._DEFAULT_FUNC_BACKGROUND_COLOR;
        let icon = IconLibrary.FUNCTION;

        // Special case for construction node
        if (node.class === UnrealNodeClass.FUNCTION_ENTRY) {
            icon = this.handleFunctionNode(node);
        }

        const parser = CallFunctionNodeParser._FUNCTION_MAP[node.functionReference?.memberParent?.classPath];
        if (parser) return parser(data);

        if (node.advancedPinDisplay !== undefined) {
            return new FoldableHeadedNodeControl(node, icon);
        } else {
            return new HeadedNodeControl(node, icon);
        }
    }

    private handleFunctionNode(node: CallFunctionNode) {
        node.backgroundColor = CallFunctionNodeParser._DEFAULT_FUNC_ENTRY_BACKGROUND_COLOR;
        node.title = insertSpacesBetweenCapitalizedWords(
            node.functionReference.memberName.replace('UserConstructionScript', 'ConstructionScript'));
        return IconLibrary.BREAK_STRUCT;
    }

}
