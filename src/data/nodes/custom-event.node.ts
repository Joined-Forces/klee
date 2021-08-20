import { ReplicationType } from "../replication-type";
import { Node } from "./node";

export interface CustomEventNode extends Node {
    customFunctionName: string;
    errorType: number;
    functionFlags: number;
    reliable: boolean;
    replicationType: ReplicationType;
}
