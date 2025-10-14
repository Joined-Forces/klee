/// <reference types="jest" />

import { PinPropertyParser } from '../../parser/pin-property.parser';
import { PinDirection } from '../../data/pin/pin-direction';

describe('PinPropertyParser - serializeAsSinglePrecisionFloat', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('PinPropertyParser can parse bSerializeAsSinglePrecisionFloat=True', () => {
      const propertyData = 'PinId=7E57DA7A000000000000000000000000,PinName="TestPinTrue",PinType.PinCategory="float",PinType.bSerializeAsSinglePrecisionFloat=True';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.serializeAsSinglePrecisionFloat).toBe(true);
    });

    test('PinPropertyParser can parse bSerializeAsSinglePrecisionFloat=False', () => {
      const propertyData = 'PinId=7E57DA7A000000000000000000000000,PinName="TestPinFalse",PinType.PinCategory="float",PinType.bSerializeAsSinglePrecisionFloat=False';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.serializeAsSinglePrecisionFloat).toBe(false);
    });
});

describe('PinPropertyParser - SubPins', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('PinPropertyParser can parse SubPins property', () => {
      const propertyData = 'PinId=123,PinName="TestPin",SubPins=(Node1 ABC,Node2 DEF,)';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.subPins).toBe('(Node1 ABC,Node2 DEF,)');
    });

    test('PinPropertyParser can parse empty SubPins', () => {
      const propertyData = 'PinId=456,PinName="TestPin",SubPins=()';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.subPins).toBe('()');
    });
});

describe('PinPropertyParser - ParentPin', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('PinPropertyParser can parse ParentPin property', () => {
      const propertyData = 'PinId=123,PinName="TestPin",ParentPin="ParentPinName"';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.parentPin).toBe('ParentPinName');
    });

    test('PinPropertyParser can parse empty ParentPin', () => {
      const propertyData = 'PinId=456,PinName="TestPin",ParentPin=""';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.parentPin).toBe('');
    });
});

describe('PinPropertyParser - DesiredPinDirection', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('PinPropertyParser can parse DesiredPinDirection=EGPD_Output', () => {
      const propertyData = 'PinName="Context",PinType=(PinCategory="object"),DesiredPinDirection=EGPD_Output';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.direction).toBe(PinDirection.EGPD_Output);
    });

    test('PinPropertyParser can parse DesiredPinDirection=EGPD_Input', () => {
      const propertyData = 'PinName="InputPin",PinType=(PinCategory="object"),DesiredPinDirection=EGPD_Input';
      const pinProperty = parser.parse(propertyData, 'TestNode');

      expect(pinProperty).toBeDefined();
      expect(pinProperty.direction).toBe(PinDirection.EGPD_Input);
    });
});

describe('PinPropertyParser - subCategoryObject null checks', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('Handles null subCategoryObject for PinCategory struct', () => {
        const propertyData = 'PinName="TestStruct",PinType.PinCategory="struct"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Test Struct');
        expect(pinProperty.category).toBe('struct');
        expect(pinProperty.subCategoryObject).toBeUndefined();
    });

    test('Handles null subCategoryObject for struct with DefaultValue', () => {
        const propertyData = 'PinName="TestStruct",PinType.PinCategory="struct",DefaultValue="(X=1.0,Y=2.0,Z=3.0)"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Test Struct');
        expect(pinProperty.category).toBe('struct');
        expect(pinProperty.subCategoryObject).toBeUndefined();
        expect(pinProperty.defaultValue).toBeDefined();
    });

    test('Handles missing subCategoryObject for PinCategory byte with DefaultValue', () => {
        const propertyData = 'PinName="TestByte",PinType.PinCategory="byte",DefaultValue="255"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Test Byte');
        expect(pinProperty.category).toBe('byte');
        expect(pinProperty.subCategoryObject).toBeUndefined();
        expect(pinProperty.defaultValue).toBeDefined();
    });
});

describe('PinPropertyParser - support for INVTEXT', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('Can parse PinFriendlyName with INVTEXT', () => {
        const propertyData = 'PinName="QueryExtent_Z",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", INVTEXT("Query Extent"), "ProtoPinDisplayName", INVTEXT("Z"))';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Query Extent Z');
        expect(pinProperty.name).not.toContain('INVTEXT');
        expect(pinProperty.friendlyName).toBe('Query Extent Z');
    });

    test('Can parse simple INVTEXT PinFriendlyName', () => {
        const propertyData = 'PinName="PropertyKey",PinFriendlyName=INVTEXT("Property Key")';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Property Key');
        expect(pinProperty.friendlyName).toBe('Property Key');
        expect(pinProperty.friendlyName).not.toContain('INVTEXT');
    });
});
