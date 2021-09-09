import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CallFunctionNode } from "../../data/nodes/call-function.node";
import { PinProperty } from "../../data/pin/pin-property";
import { MathFunctionNodeParser } from "./math-function-node.parser";
import { NodeDataReferenceParser } from "../node-data-reference.parser";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { insertSpacesBetweenCapitalizedWords, findFriendlyName } from "../../utils/text-utils";
import { IconLibrary } from "../../controls/utils/icon-library";
import { UnrealNodeClass } from "../../data/classes/unreal-node-class";


export class FunctionEntryNodeParser extends NodeParser {

    private static readonly _DEFAULT_FUNC_ENTRY_BACKGROUND_COLOR = '109, 19, 132';


    constructor() {
        super({
            "FunctionReference": (node: CallFunctionNode, value: string) => {
                const parser = new NodeDataReferenceParser();
                node.functionReference = parser.parse(value);
                node.functionReference.memberName = node.functionReference.memberName.replace('UserConstructionScript', 'ConstructionScript');
                node.backgroundColor = FunctionEntryNodeParser._DEFAULT_FUNC_ENTRY_BACKGROUND_COLOR;
                if(node.class === UnrealNodeClass.FUNCTION_RESULT) {
                    node.title = 'Return Node';
                } else {
                    node.title = insertSpacesBetweenCapitalizedWords(findFriendlyName(node.functionReference.memberName));
                }
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const node = data.node as CallFunctionNode;

        this.parseProperties(data);

        return new HeadedNodeControl(node, IconLibrary.CONSTRUCT);
    }
}
