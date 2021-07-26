import { CustomProperty } from "./custom-property";
import { NodeClass } from "./node-class";
import { PinProperty } from "./pin-property";

export class NodeObject {

    _class: NodeClass;
    name: string;
    
    nodePosX: number;
    nodePosY: number;
    nodeGUID: string;

    customProperties: Array<CustomProperty>;

    constructor() {
        this.customProperties = new Array<CustomProperty>();
    }

    parse(objectLines: string[]) {
    public get class(): NodeClass {
        return this._class;
    }

    public set class(v: NodeClass) {
        this._class = v;
    }

        let line: string;

        for (let i = 0; i < objectLines.length; ++i) {
            line = objectLines[i];

            if (line.startsWith('CustomProperties')) {
                let propertyLine = line.substr("CustomProperties".length).trim();
                this.parseCustomProperty(propertyLine);
                continue;
            }

            let dataset = line.split('=');
            let key = dataset.shift();
            let value = dataset.join('=');

            this.parseAttribute(key, value);
        }
    }

    parseAttribute(name: string, value: string) {
        switch (name) {
            case "NodePosX": this.nodePosX = Number.parseInt(value); break;
            case "NodePosY": this.nodePosY = Number.parseInt(value); break;
            case "NodeGuid": this.nodeGUID = value;
        }
    }

    parseCustomProperty(propertyLine: string) {

        let dataset = propertyLine.split(' ');
        let type = dataset.shift();
        let data = dataset.join(' ');

        data = data.trim();
        data = data.substr(1, data.length - 2);

        let property: CustomProperty;

        switch (type) {
            case "Pin": property = new PinProperty(this._class); break;
            default: return;
        }

        property.parse(data);
        this.customProperties.push(property);
    }

    get isMathFunction(): boolean {
        return false;
    }

    get isRerouteNode(): boolean {
        return this.class === NodeClass.KNOT;
    }

    getName(): string {
        return this.name;
    }
}
