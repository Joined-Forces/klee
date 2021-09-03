import { NodeClassReference } from "./node-class-reference";

export interface NodeDataReference {
    memberName?: string;
    memberParent?: NodeClassReference;
    memberGUID?: string;
    selfContext?: boolean;  // e.g.: Used to call a custom event within the same graph
}
