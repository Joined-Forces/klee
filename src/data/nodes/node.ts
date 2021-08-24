import { Vector2 } from "../../math/vector2";
import { CustomProperty } from "../custom-property";
import { NodeClass } from "../node-class";



export interface Node {
    class: NodeClass;
    name: string;
    title: string;
    subTitles?: Array<{
        orderIndex?: number,
        text: string
    }>;
    guid: string;
    pos: Vector2;
    sourceText: string;
    customProperties: CustomProperty[];
    backgroundColor: string;
}
