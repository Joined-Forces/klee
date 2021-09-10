import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { IconLibrary } from "../../controls/utils/icon-library";
import { SelectNode } from "../../data/nodes/select.node";
import { PinCategory } from "../../data/pin/pin-category";
import { PinProperty } from "../../data/pin/pin-property";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


export class SelectNodeParser extends NodeParser {

    constructor() {
        super({
            "IndexPinType": (node: SelectNode, value: string) => { 
                value = value.replace(/[()]/g, '');
                let properties = value.split(',');

                let category, subCategory;

                for (let property of properties) {
                    let keyValue = property.split('=');

                    if (keyValue[0] == "PinCategory") {
                        category = keyValue[1].replace('"', '') as PinCategory;
                    }
                    if (keyValue[0] == "PinSubCategory") {
                        subCategory = keyValue[1].replace('"', '');
                    }
                }

                node.indexPinType = { category: category, subCategory: subCategory };
            },
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);

        data.node.title = "Select";

        SelectNodeParser.changePinsToReference(data);

        
        return new HeadedNodeControl(data.node, IconLibrary.SELECT);
    }

    private static changePinsToReference(data: ParsingNodeData) {
        // The copied blueprint pins have not set the bIsReference flag to true.
        // The Select node always passes references therefore we have to set them manually
        for (let property of data.node.customProperties) {
            if (property instanceof PinProperty) {
                if (property.name.toLowerCase() !== "index") {
                    (property as PinProperty).isReference = true;
                }
            }
        }
    }
}
