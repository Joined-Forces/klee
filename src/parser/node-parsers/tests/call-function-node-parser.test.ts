/// <reference types="jest" />

import { CallFunctionNodeParser } from '../call-function-node.parser';
import { ParsingNodeData } from '../../parsing-node-data';
import { CallFunctionNode } from '../../../data/nodes/call-function.node';
import { Vector2 } from '../../../math/vector2';

describe('CallFunctionNodeParser', () => {
    test('bDefaultsToPureFunc=True sets isPureFunc to true', () => {
        const parser = new CallFunctionNodeParser();

        const node: CallFunctionNode = {
            pos: new Vector2(0, 0),
            title: 'Test',
            subTitles: [],
            customProperties: [],
            isPureFunc: false,
            isConstFunc: false,
            functionReference: null
        } as CallFunctionNode;

        const parsingData = new ParsingNodeData([
            'Begin Object',
            'bDefaultsToPureFunc=True',
            'End Object'
        ]);

        parsingData.node = node;
        parser.parse(parsingData);
        expect(node.isPureFunc).toBe(true);
    });
});
