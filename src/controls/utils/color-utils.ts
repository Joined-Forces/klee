import { PinCategory } from "../../data/custom-property";
import { NodeClass } from "../../data/node-class";
import { PinProperty } from "../../data/pin-property";

export class ColorUtils {

    public static getNodeColorForClass(nodeClass: NodeClass): string {
        switch (nodeClass) {
            case NodeClass.INPUT_AXIS_EVENT:
                return '156, 36, 35';
            case NodeClass.IF_THEN_ELSE:
                return '150, 150, 150';
            default:
                return '109, 147, 104';
        }
    }

    public static getPinColor(pin: PinProperty): string {
        switch (pin.pinCategory) {
            case PinCategory.bool:
                return 'rgb(146, 1, 1)';
            case PinCategory.float:
                return 'rgb(158, 250, 68)';
            case PinCategory.struct:
                switch (pin.pinSubCategoryObject) {
                    case NodeClass.VECTOR:
                        return 'rgb(253, 200, 35)';
                    case NodeClass.ROTATOR:
                        return 'rgb(159, 178, 253)';
                    default:
                        return 'rgb(0, 88, 200)';
                }
            case PinCategory.name:
                return 'rgb(150, 97, 185)';
            case PinCategory.object:
                return 'rgb(0, 133, 191)';
            default: 
                return 'rgb(230, 230, 230)';
        }
    }

}