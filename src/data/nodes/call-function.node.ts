import { NodeDataReference } from "../node-data-reference";
import { Node } from "./node";

export interface CallFunctionNode extends Node {
    functionReference: NodeDataReference;
}
