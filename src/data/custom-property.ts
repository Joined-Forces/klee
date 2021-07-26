
export class CustomProperty {

    parse(propertyData: string) {

    }
}

export enum PinDirection {
    EGPD_Input,
    EGPD_Output
}

export enum PinCategory {
    delegate,
    exec,
    object,
    int,
    int64,
    float,
    struct,
    bool,
    name
}

export class PinLink {
    nodeName: string;
    pinID: string;
}
