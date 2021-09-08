import { Node } from "./node";

export interface GetArrayItemNode extends Node {
    returnByRefDesired?: boolean;
}
