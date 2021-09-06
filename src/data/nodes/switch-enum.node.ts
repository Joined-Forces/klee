import { Node } from "./node";

export interface SwitchEnumNode extends Node {
    enum: string,
    enumEntries: string[]
}
