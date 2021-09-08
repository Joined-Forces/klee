import { NodeDataReference } from "../node-data-reference";
import { Node } from "./node";

export interface InputKeyNode extends Node {
    inputKey: string;
    control: boolean;
    alt: boolean;
    shift: boolean;
    command: boolean;
}
