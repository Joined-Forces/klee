import { NodeDataReference } from "../node-data-reference";
import { Node } from "./node";

export interface EventNode extends Node {
    eventReference: NodeDataReference,
    overrideFunction: boolean
}
