/// <reference types="jest" />

import { ColorUtils } from '../color-utils';
import { PinProperty } from '../../../data/pin/pin-property';
import { PinCategory } from '../../../data/pin/pin-category';

describe('ColorUtils', () => {
    test('getPinColor handles null subCategoryObject', () => {
        const pin = new PinProperty('TestNode');
        pin.category = PinCategory.object;
        pin.subCategoryObject = undefined;

        const color = ColorUtils.getPinColor(pin);

        expect(color).toBeDefined();
        expect(typeof color).toBe('string');
    });

    test('getPinColor returns correct color for real category', () => {
        const realPin = new PinProperty('RealPin');
        realPin.category = PinCategory.real;
        const realColor = ColorUtils.getPinColor(realPin);

        const floatPin = new PinProperty('FloatPin');
        floatPin.category = PinCategory.float;
        const floatColor = ColorUtils.getPinColor(floatPin);

        expect(realColor).toBeDefined();
        expect(typeof realColor).toBe('string');
        expect(realColor).toBe(floatColor);
    });
});

