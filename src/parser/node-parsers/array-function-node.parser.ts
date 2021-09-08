import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { MathFunctionNode } from "../../data/nodes/math-function.node";
import { PinProperty } from "../../data/pin/pin-property";
import { insertSpacesBetweenCapitalizedWords } from "../../utils/text-utils";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";

export interface MathFunction {
    name: string;
    displayName: string;
    isPrimitive?: boolean;
    //description: string;
}

export class ArrayFunctionNodeParser extends NodeParser {

    private static readonly FUNCTIONS: Array<MathFunction> = [
        { name: 'Array_Identical', displayName: '==', isPrimitive: true },
        { name: 'Array_Remove', displayName: 'REMOVE INDEX', isPrimitive: true },
        { name: 'Array_RemoveItem', displayName: 'REMOVE', isPrimitive: true },
        { name: 'Array_RandomFromStream', displayName: 'Random Array Item from Stream', isPrimitive: false },
        { name: 'Array_Set', displayName: 'Set Array Elem', isPrimitive: false }
    ];

    public parse(data: ParsingNodeData): NodeControl {
        const node = data.node as MathFunctionNode;

        let isPrimitive = false;

        // Check if there is an exceptional case
        const func = ArrayFunctionNodeParser.FUNCTIONS.find(f => node.functionReference.memberName === f.name);
        if(func) {
            node.title = func.displayName;
            isPrimitive = func.isPrimitive;
        } else {

            // Do the common intepretation
            if(node.functionReference.memberName.startsWith('Array_')) {
                node.title = node.functionReference.memberName.substr(6);
                node.title = insertSpacesBetweenCapitalizedWords(node.title).toUpperCase();
                isPrimitive = true;
            }
        }

        node.subTitles = [];
        if(isPrimitive === true) {
            BlueprintParserUtils.hidePinNames(node.customProperties);
            return new HeadlessNodeControl(node);
        }
        return new HeadedNodeControl(node, IconLibrary.FUNCTION);
    }
}
