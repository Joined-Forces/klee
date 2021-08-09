import { Node } from "./node";

export interface CommentNode extends Node {
    width: number;
    height: number;
    comment: string;
}
