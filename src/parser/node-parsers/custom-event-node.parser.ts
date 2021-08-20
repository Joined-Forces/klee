import { HeadedNodeControl } from "../../controls/nodes/headed-node-control";
import { NodeControl } from "../../controls/nodes/node.control";
import { CustomEventNode } from "../../data/nodes/custom-event.node";
import { ReplicationType } from "../../data/replication-type";
import { NodeParser } from "../node.parser";
import { ParsingNodeData } from "../parsing-node-data";


/*

FunctionFlags:
-------------------------------------------------

Multicast:   FunctionFlags=16448
RunOnServer: FunctionFlags=2097216
RunOnOwning: FunctionFlags=16777280

0000 0000 0000 0000 0000 0100 0000, 2^6: Probably if event replicates in general
0000 0000 0000 0000 0000 1000 0000, 2^7: Reliable
0000 0000 0000 0100 0000 0000 0000, 2^14: Multicast
0000 0010 0000 0000 0000 0000 0000, 2^21: Run on Server
0001 0000 0000 0000 0000 0000 0000, 2^24: Run on owning Client

*/


export class CustomEventNodeParser extends NodeParser {

    private static readonly FUNCTION_FLAG_RELIABLE = 64;
    private static readonly FUNCTION_FLAG_BIT_MASKS = {
        [ReplicationType.Multicast]: 16384,
        [ReplicationType.RunOnServer]: 2097152,
        [ReplicationType.RunOnOwningClient]: 16777216,
    }
    private static readonly REPLICATION_TYPE_TEXTS = {
        [ReplicationType.Multicast]: 'Executes On All',
        [ReplicationType.RunOnServer]: 'Executes On Server',
        [ReplicationType.RunOnOwningClient]: 'Executes On Owning Client',
    }

    constructor() {
        super({
            "CustomFunctionName": (node: CustomEventNode, value: string) => {
                node.customFunctionName = value.replace(/"/g, '');
                node.title = node.customFunctionName;
                node.subTitles.unshift({text: 'Custom Event'});
            },
            "FunctionFlags": (node: CustomEventNode, value: string) => {
                node.functionFlags = Number.parseInt(value);
                node.reliable = ((node.functionFlags & CustomEventNodeParser.FUNCTION_FLAG_RELIABLE) != 0);
                node.replicationType = this.getReplicationType(node.functionFlags);
                if (node.replicationType !== ReplicationType.NotReplicated) {
                    const repKey = ReplicationType[node.replicationType];
                    const text = CustomEventNodeParser.REPLICATION_TYPE_TEXTS[repKey];
                    node.subTitles.unshift({text, orderIndex: 1});
                }
            },
            "ErrorType": (node: CustomEventNode, value: string) => { node.errorType = Number.parseInt(value); }
        });
    }

    public parse(data: ParsingNodeData): NodeControl {
        this.parseProperties(data);
        return new HeadedNodeControl(data.node);
    }

    private getReplicationType(functionFlags: number): ReplicationType {
        for (const prop in CustomEventNodeParser.FUNCTION_FLAG_BIT_MASKS) {
            if (Object.prototype.hasOwnProperty.call(CustomEventNodeParser.FUNCTION_FLAG_BIT_MASKS, prop)) {
                const bitMask = CustomEventNodeParser.FUNCTION_FLAG_BIT_MASKS[prop];
                if((functionFlags & bitMask) != 0) {
                    return ReplicationType[prop];
                }
            }
        }
        return ReplicationType.NotReplicated;
    }
}
