import { NodeClassReference } from "../node-class-reference";
import { Node } from "./node";

export interface SetFieldsInStructNode extends Node {
    structType: NodeClassReference
}
