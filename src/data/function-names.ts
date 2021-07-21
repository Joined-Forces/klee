export class NodeFunctionNames {

    private static readonly FUNCTION_NAMES = {
        "K2_GetComponentRotation": "GetWorldRotation",
        "GreaterGreater_VectorRotator": "RotateVector"
    }

    static translate(value: string) {
        for (let key in NodeFunctionNames.FUNCTION_NAMES) {
            let name = NodeFunctionNames.FUNCTION_NAMES[key]

            value = value.replace(key, name);
        }

        return value;
    }
}