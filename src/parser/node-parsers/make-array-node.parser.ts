import { NodeControl } from "../../controls/nodes/node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { Constants } from "../../constants";
import { IconLibrary } from "../../controls/utils/icon-library";


export class MakeArrayNodeParser extends NodeParser {

    public parse(data: ParsingNodeData): NodeControl {

        data.node.title = 'Make Array';
        data.node.backgroundColor = Constants.DEFAULT_FUNC_PURE_BACKGROUND_COLOR;

        return new HeadedNodeControl(data.node, IconLibrary.MAKE_ARRAY);
    }
}
