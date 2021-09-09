import { PinCategory } from "../../data/pin/pin-category";
import { PinProperty } from "../../data/pin/pin-property";

export enum StructClass {
    VECTOR = "/Script/CoreUObject.Vector",
    ROTATOR = "/Script/CoreUObject.Rotator",
    LatentActionInfo = "/Script/Engine.LatentActionInfo",
    LINEAR_COLOR = "/Script/CoreUObject.LinearColor",
    VECTOR2D = "/Script/CoreUObject.Vector2D",
}

export class ColorUtils {

    public static getPinColor(pin: PinProperty): string {
        return this.getPinColorByCategory(pin.category, pin.subCategoryObject);
    }

    public static getPinColorByCategory(category: PinCategory, subCategoryObject?: string): string {
        switch (category) {
            case PinCategory.delegate:
                return 'rgb(255, 56, 56)';
            case PinCategory.bool:
                return 'rgb(146, 1, 1)';
            case PinCategory.float:
                return 'rgb(158, 250, 68)';
            case PinCategory.int:
                return 'rgb(30, 226, 174)';
            case PinCategory.int64:
                return 'rgb(171, 226, 174)';
            case PinCategory.byte:
                return 'rgb(0, 101, 92)';
            case PinCategory.struct:
                const map = {
                    [StructClass.VECTOR]: 'rgb(253, 200, 35)',
                    [StructClass.ROTATOR]: 'rgb(159, 178, 253)'
                }
                return map[subCategoryObject] || 'rgb(0, 88, 200)';

            case PinCategory.name:
                return 'rgb(150, 97, 185)';
            case PinCategory.string:
                return 'rgb(254, 0, 212)';
            case PinCategory.object:
                return 'rgb(0, 133, 191)';
            case PinCategory.class:
                return 'rgb(88, 0, 187)';
            case PinCategory.wildcard:
                return 'rgb(128, 121, 121)';
            case PinCategory.text:
                return 'rgb(230, 123, 169)';
            case PinCategory.byte:
                return 'rgb(0, 110, 100)';
            default: 
                return 'rgb(230, 230, 230)';
        }
    }
}
