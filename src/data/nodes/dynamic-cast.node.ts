import { NodeClassReference } from "../node-class-reference";
import { Node } from "./node";

export interface DynamicCastNode extends Node {
    targetType: NodeClassReference;
}
