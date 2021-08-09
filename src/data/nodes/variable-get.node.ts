import { NodeDataReference } from "../node-data-reference";
import { Node } from "./node";

export interface VariableGetNode extends Node {
    variableReference: NodeDataReference;
}
