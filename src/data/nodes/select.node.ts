import { NodeClassReference } from "../node-class-reference";
import { PinCategory } from "../pin/pin-category";
import { Node } from "./node";

export interface SelectNode extends Node {
    indexPinType: { category: PinCategory, subCategory: string },
}
