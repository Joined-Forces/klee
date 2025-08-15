import { NodeControl } from "../controls/nodes/node.control";
import { IconLibrary } from "../controls/utils/icon-library";
import { ParsingNodeData } from "../parser/parsing-node-data";
import { findFriendlyName } from "../utils/text-utils";
import { HeadedNodeControl } from "../controls/nodes/headed-node-control";
import { Constants } from "../constants";
import { NodeParser } from "../parser/node.parser";
import { CallFunctionNodeParser } from "../parser/node-parsers/call-function-node.parser";


export class BreakFunctionParamParser extends CallFunctionNodeParser {
    public parse(data: ParsingNodeData): NodeControl {
        const baseNodeName = data.node.name.replace(/_\d+$/, '');
        const friendlyName = findFriendlyName(baseNodeName);
        if (friendlyName !== baseNodeName) {
            data.node.title = friendlyName;
        }
        data.node.backgroundColor = Constants.GREEN;
        return super.parse(data);
    }
}

export class BlueConstructNodeParser extends NodeParser {
    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        
        data.node.backgroundColor = Constants.BLUE;
        
        return new HeadedNodeControl(data.node, IconLibrary.CONSTRUCT);
    }
}

export class BrownEventNodeParser extends NodeParser {
    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
    
        
        data.node.backgroundColor = Constants.BROWN;
        
        return new HeadedNodeControl(data.node, IconLibrary.EVENT);
    }
}

export class GreenConstructNodeParser extends NodeParser {
    public parse(data: ParsingNodeData): NodeControl {
    
        data.node.backgroundColor = Constants.GREEN;
        
        return new HeadedNodeControl(data.node, IconLibrary.CONSTRUCT);
    }
}

export class GreenFunctionNodeParser extends CallFunctionNodeParser {
    public parse(data: ParsingNodeData): NodeControl {        
        const baseNodeName = data.node.name.replace(/_\d+$/, '');
        const friendlyName = findFriendlyName(baseNodeName);
        if (friendlyName !== baseNodeName) {
            data.node.title = friendlyName;
        }
        
        data.node.backgroundColor = Constants.GREEN;
        
        return super.parse(data);
    }
}

export class PurpleConstructNodeParser extends NodeParser {
    public parse(data: ParsingNodeData): NodeControl {

        
        data.node.backgroundColor = Constants.PURPLE;
        
        return new HeadedNodeControl(data.node, IconLibrary.CONSTRUCT);
    }
}

