import { NodeControl } from "../../controls/nodes/node.control";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { GetArrayItemNode } from "../../data/nodes/get-array-item.node";
import { HeadlessNodeControl } from "../../controls/nodes/headless-node-control";
import { PinProperty } from "../../data/pin/pin-property";
import { BlueprintParserUtils } from "../blueprint-parser-utils";


export class GetArrayItemNodeParser extends NodeParser {


    constructor() {
        super({
            "bReturnByRefDesired": (node: GetArrayItemNode, value: string) => { node.returnByRefDesired = !(value === "False"); },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {

        const node = data.node as GetArrayItemNode;
        node.returnByRefDesired = true;

        this.parseProperties(data);

        node.title = 'GET';
        node.subTitles.push({
            text: (node.returnByRefDesired === true) ? 'a ref' : 'a copy'
        });

        BlueprintParserUtils.hidePinNames(node.customProperties);

        return new HeadlessNodeControl(node);
    }
}
