import { NodeDataReference } from "../node-data-reference";
import { Node } from "./node";

export enum VariableType {
    Getter,
    Setter
}

export interface VariableNode extends Node {
    variableType: VariableType,
    variableReference: NodeDataReference;
}
