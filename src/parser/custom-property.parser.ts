import { CustomProperty } from "../data/custom-property";

export interface CustomPropertyParser {
    parse(propertyData: string, nodeName: string): CustomProperty;
}
