/// <reference types="jest" />

import { GenericNodeParser } from '../generic-node.parser';
import { NodeParserRegistry } from "../../node-parser-registry";
import { ParsingNodeData } from '../../parsing-node-data';
import { PinDirection } from '../../../data/pin/pin-direction';
import { TestableNodeControl } from '../../../tests/testable-node-control';


// Mock UnrealNodeClass to reduce expensive constructor loop
jest.mock('../../../data/classes/unreal-node-class', () => ({
  UnrealNodeClass: {
    CUSTOM_EVENT: '/Script/BlueprintGraph.K2Node_CustomEvent'
  }
}));

describe('GenericNodeParser', () => {
    let parser: GenericNodeParser;

    beforeEach(() => {
        let nodeParserRegistry = new NodeParserRegistry();
        parser = new GenericNodeParser(nodeParserRegistry);
    });

    test('Can parse CustomProperties UserDefinedPin', () => {
        const lines = [
            'Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="K2Node_CustomEvent_4"',
            '   NodeGuid=7E57DA7A000000000000000000000000',
            'CustomProperties UserDefinedPin (PinName="Context",PinType=(PinCategory="object"),DesiredPinDirection=EGPD_Output)',
            'End Object'
        ];

        const parsingData = new ParsingNodeData(lines);
        const nodeControl = parser.parse(parsingData);
        const result = new TestableNodeControl(nodeControl);

        expect(result).toBeDefined();
        expect(result.node).toBeDefined();
        expect(result.node.customProperties).toBeDefined();

        const userDefinedPin = result.node.customProperties.find((prop: any) => 
            prop.constructor.name === 'PinProperty' && prop.name === 'Context'
        ) as any;

        expect(userDefinedPin).toBeDefined();
        expect(userDefinedPin.name).toBe('Context');
        expect(userDefinedPin.category).toBe('object');
        expect(userDefinedPin.direction).toBe(PinDirection.EGPD_Output);
    });

});
    
