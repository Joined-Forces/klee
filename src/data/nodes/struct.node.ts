import { NodeClassReference } from "../node-class-reference";
import { Node } from "./node";

export interface StructNode extends Node {
    structType: NodeClassReference
}
