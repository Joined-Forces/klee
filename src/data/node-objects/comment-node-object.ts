import { NodeObject } from "../node-object";

export class CommentNodeObject extends NodeObject {

    nodeWidth: number;
    nodeHeight: number;
    nodeComment: string;

    parseAttribute(name: string, value: string) {
        super.parseAttribute(name, value);

        switch (name) {
            case "NodeWidth": this.nodeWidth = Number.parseInt(value); break;
            case "NodeHeight": this.nodeHeight = Number.parseInt(value); break;
            case "NodeComment": this.nodeComment = value.replace(/"/g, ''); break;
        }
    }

    getName() {
        return this.nodeComment;
    }
}
