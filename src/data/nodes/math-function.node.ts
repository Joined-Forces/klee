import { CallFunctionNode } from "./call-function.node";

export interface MathFunctionNode extends CallFunctionNode {
    isPrimitiveNode: boolean;
}
