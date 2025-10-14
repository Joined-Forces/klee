/// <reference types="jest" />

import { Label } from '../label';

describe('Label', () => {
    test('constructor sets default values', () => {
        const label = new Label('Test Text');

        expect(label.text).toBe('Test Text');
        expect(label.textAlign).toBeDefined();
        expect(label.font).toBeDefined();
        expect(label.color).toBeDefined();
    });
});
