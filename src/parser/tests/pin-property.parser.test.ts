/// <reference types="jest" />

import { PinPropertyParser } from '../../parser/pin-property.parser';
import { PinDirection } from '../../data/pin/pin-direction';
import { ColorBoxControl } from '../../controls/color-box.control';
import { Color } from '../../data/color';


describe('PinPropertyParser - Regex Value Parsing', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('Type 1: Can parse quoted values', () => {
        const propertyData = 'PinId=ABC123,PinName="self"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Self'); // Parser applies prettifyText which capitalizes
    });

    test('Type 2: Can parse values set in brackets', () => {
        const propertyData = 'PinId=ABC123,PinName="TestPin",LinkedTo=(K2Node_CallFunction_0 ABC12300000000000000000000000000,K2Node_Event_1 789DEF123,)';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.linkedTo).toBeDefined();
        expect(Array.isArray(pinProperty.linkedTo)).toBe(true);
        expect(pinProperty.linkedTo.length).toBe(2);
    });

    test('Type 3: Can parse multilevel loctext', () => {
        const propertyData = 'PinName="TestPin",PinFriendlyName=LOCGEN_FORMAT_NAMED(NSLOCTEXT("KismetSchema", "SplitPinFriendlyNameFormat", "{PinDisplayName} {ProtoPinDisplayName}"), "PinDisplayName", NSLOCTEXT("", "E767B2BA4B1D5DFDD5E21E953300AB1E", "Settings"), "ProtoPinDisplayName", NSLOCTEXT("", "182F932842DA4BEA8624D89F6CD70FDA", "Attenuation Settings"))';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        // Format string {PinDisplayName} {ProtoPinDisplayName} gets keys replaced with prettified values
        expect(pinProperty.friendlyName).toBe('Proto Pin Display Name Attenuation Settings');
    });

    test('Type 4: Can parse method values', () => {
        const propertyData = 'PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target")';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.friendlyName).toBe('Target');
    });

    test('Type 5: Can parse pure values', () => {
        const propertyData = 'PinId=123,PinName="TestPin",PinType.bIsConst=False,PinType.bIsReference=True';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.isConst).toBe(false);
        expect(pinProperty.isReference).toBe(true);
    });

    test('Type 6: Can parse struct values with escaped quotes', () => {
        const propertyData = 'PinId=ABC123,PinName="LatentInfo",PinType.PinCategory="struct",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct\'/Script/Engine.LatentActionInfo\'",DefaultValue="(Linkage=-1,UUID=-1,ExecutionFunction=\\"\\",CallbackTarget=None)",bHidden=True';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Latent Info');
        expect(pinProperty.category).toBe('struct');
        expect(pinProperty.hidden).toBe(true);
        expect(pinProperty.defaultValue).toBeDefined();
        expect(Array.isArray(pinProperty.defaultValue)).toBe(true);

        const structFields = pinProperty.defaultValue as Array<{ key: string, value: string }>;
        expect(structFields.length).toBe(4);
        expect(structFields.find(f => f.key === 'Linkage')).toBeDefined();
        expect(structFields.find(f => f.key === 'UUID')).toBeDefined();
        expect(structFields.find(f => f.key === 'ExecutionFunction')).toBeDefined();
        expect(structFields.find(f => f.key === 'CallbackTarget')).toBeDefined();
        expect(structFields.find(f => f.key === 'CallbackTarget')?.value).toBe('None');
    });

    test('Does not treat struct fields as separate pin attributes', () => {
        // i.e. doesn't split on commas inside DefaultValue with escaped quotes
        const propertyData = 'PinId=ABC123,PinName="TestPin",PinType.PinCategory="struct",PinType.PinSubCategoryObject="/Script/Engine.TestStruct",DefaultValue="(A=1,B=\\"test\\",C=None)"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Test Pin');
        expect(pinProperty.category).toBe('struct');
        expect(pinProperty.defaultValue).toBeDefined();
        expect(Array.isArray(pinProperty.defaultValue)).toBe(true);

        const structFields = pinProperty.defaultValue as Array<{ key: string, value: string }>;
        expect(structFields.length).toBe(3);
        expect(structFields.find(f => f.key === 'A')).toBeDefined();
        expect(structFields.find(f => f.key === 'B')).toBeDefined();
        expect(structFields.find(f => f.key === 'C')).toBeDefined();
    });

    test('Can parse complex property with multiple value types', () => {
        const propertyData = 'PinId=ABC123,PinName="ComplexPin",PinFriendlyName=NSLOCTEXT("", "12345", "Friendly Name"),LinkedTo=(Node1 GUID1,),PinType.bIsConst=False,DefaultValue="test"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.name).toBe('Complex Pin');
        expect(pinProperty.friendlyName).toBe('Friendly Name');
        expect(pinProperty.linkedTo).toBeDefined();
        expect(pinProperty.isConst).toBe(false);
        expect(pinProperty.defaultValue).toBe('test');
    });
});

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

describe('PinPropertyParser - LinearColor ColorBox', () => {
    let parser: PinPropertyParser;

    beforeEach(() => {
        parser = new PinPropertyParser();
    });

    test('Can parse PinSubCategoryObject with LinearColor reference', () => {
        const propertyData = 'PinName="TestColor",PinType.PinCategory="struct",PinType.PinSubCategoryObject="/Script/CoreUObject.LinearColor",DefaultValue="(R=1.0,G=0.0,B=0.0,A=1.0)"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.subCategoryObject?.class).toBe('/Script/CoreUObject.LinearColor');
        expect(pinProperty.defaultValue).toBeInstanceOf(Color);
        expect(pinProperty.defaultValueControlClass).toBe(ColorBoxControl);
    });

    test('Can parse PinSubCategoryObject with ScriptStruct wrapper', () => {
        const propertyData = 'PinName="Location",PinType.PinCategory="struct",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct\'/Script/CoreUObject.Vector\'",DefaultValue="0, 0, 0"';
        const pinProperty = parser.parse(propertyData, 'TestNode');

        expect(pinProperty).toBeDefined();
        expect(pinProperty.subCategoryObject?.class).toBe('/Script/CoreUObject.Vector');
        expect(pinProperty.subCategoryObject?.type).toBe('/Script/CoreUObject.ScriptStruct');
    });
});
