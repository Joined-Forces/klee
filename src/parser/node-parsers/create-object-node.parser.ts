import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { prettifyText } from "../../utils/text-utils";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";

export class CreateObjectNodeParser extends NodeParser {

    public parse(data: ParsingNodeData): NodeControl {
        const className = BlueprintParserUtils.getFirstClassNameFromPinProperties(data.node.customProperties) || '';
        data.node.title = `Create ${prettifyText(className)}`;

        return new HeadedNodeControl(data.node, IconLibrary.CONSTRUCT);
    }
}
