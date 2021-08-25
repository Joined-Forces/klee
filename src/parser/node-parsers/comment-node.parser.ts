import { CommentNodeControl } from "../../controls/nodes/comment-node.control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CommentNode } from "../../data/nodes/comment.node";
import { BlueprintParserUtils } from "../blueprint-parser-utils";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class CommentNodeParser extends NodeParser {

    constructor() {
        super({
            "CommentColor": (node: CommentNode, value: string) => { node.backgroundColor = BlueprintParserUtils.parseColor(value); },
            "NodeWidth": (node: CommentNode, value: string) => { node.width = Number.parseInt(value); },
            "NodeHeight": (node: CommentNode, value: string) => { node.height = Number.parseInt(value); },
            "NodeComment": (node: CommentNode, value: string) => { node.title = value.replace(/"/g, ''); }
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        return new CommentNodeControl(data.node as CommentNode);
    }
}
