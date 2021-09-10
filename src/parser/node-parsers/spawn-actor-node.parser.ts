import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";
import { PinProperty } from "../../data/pin/pin-property";
import { FoldableHeadedNodeControl } from "../../controls/nodes/foldable-headed-node.control";
import { prettifyText } from "../../utils/text-utils";

export class SpawnActorNodeParser extends NodeParser {

    private static readonly _DEFAULT_BACKGROUND_COLOR = '19, 42, 79';

    public parse(data: ParsingNodeData): NodeControl {
        data.node.backgroundColor = SpawnActorNodeParser._DEFAULT_BACKGROUND_COLOR;
        
        let title = "Spawn Actor";

        for (let property of data.node.customProperties) {
            if (property instanceof PinProperty) {
                if (property.name === "Class" && !property.isLinked) {
                    let className = property.defaultValue || "NONE";
                    title += " " + prettifyText(className);
                }
            }
        }

        data.node.title = title;
        return new FoldableHeadedNodeControl(data.node, IconLibrary.SPAWN_ACTOR);
    }
}
