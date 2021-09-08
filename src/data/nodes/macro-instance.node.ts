import { MacroGraphReference } from "../macro-graph-reference";
import { Node } from "./node";

export interface MacroInstanceNode extends Node {
    macroGraphReference: MacroGraphReference;
}