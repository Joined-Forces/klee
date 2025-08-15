import { UnrealNodeClass } from "../data/classes/unreal-node-class";
import { NodeParserPlugin, NodeParserRegistry } from "../parser/node-parser-registry";
import { CallFunctionNodeParser } from "../parser/node-parsers/call-function-node.parser";
import { HeadlessStringNodeParser } from "../parser/node-parsers/headless-string-node.parser";
import {
    BlueConstructNodeParser,
    BreakFunctionParamParser,
    BrownEventNodeParser,
    GreenConstructNodeParser,
    GreenFunctionNodeParser,
    PurpleConstructNodeParser
} from "./aa-node.parsers";

class AANodeParserPlugin implements NodeParserPlugin {
    UnrealNodeClass.ADD_DELEGATE = "/Script/BlueprintGraph.K2Node_AddDelegate";
    UnrealNodeClass.AGENCY_FUNCTION_RESULT = "/Script/ABEUncooked.K2Node_AgencyFunctionResult";
    UnrealNodeClass.AI_MOVE_TO = "/Script/AIGraph.K2Node_AIMoveTo";
    UnrealNodeClass.BREAK_COMPLEX_FUNCTION_PARAM_VALUES = "/Script/ABEUncooked.K2Node_BreakComplexFunctionParamValues";
    UnrealNodeClass.CALL_PARENT_FUNCTION = "/Script/BlueprintGraph.K2Node_CallParentFunction";
    UnrealNodeClass.CONV_TEXT = "/Script/ABEUncooked.Conv_Text";
    private static readonly CREATE_DELEGATE = "/Script/BlueprintGraph.K2Node_CreateDelegate";
    private static readonly FORMAT_TEXT = "/Script/BlueprintGraph.K2Node_FormatText";
    private static readonly GET_SUBSYSTEM = "/Script/BlueprintGraph.K2Node_GetSubsystem";
    private static readonly PROJECT_POINT_TO_NAVIGATION = "/Script/NavigationSystem.NavigationSystemV1";
    private static readonly PROMOTABLE_OPERATOR = "/Script/BlueprintGraph.K2Node_PromotableOperator";

    registerNodeParsers() {
        const registry = NodeParserRegistry.getInstance();

        registry.registerParser(AANodeParserPlugin.BREAK_COMPLEX_FUNCTION_PARAM_VALUES, () => new BreakFunctionParamParser());
        registry.registerParser(AANodeParserPlugin.FORMAT_TEXT, () => new GreenConstructNodeParser());
        registry.registerParser(AANodeParserPlugin.CONV_TEXT, () => new HeadlessStringNodeParser());
        registry.registerParser(AANodeParserPlugin.AGENCY_FUNCTION_RESULT, () => new PurpleConstructNodeParser());
        registry.registerParser(AANodeParserPlugin.AI_MOVE_TO, () => new BlueConstructNodeParser());
        registry.registerParser(AANodeParserPlugin.ADD_DELEGATE, () => new BlueConstructNodeParser());
        registry.registerParser(AANodeParserPlugin.CALL_PARENT_FUNCTION, () => new BrownEventNodeParser());
        registry.registerParser(AANodeParserPlugin.CREATE_DELEGATE, () => new GreenConstructNodeParser());
        registry.registerParser(AANodeParserPlugin.GET_SUBSYSTEM, () => new CallFunctionNodeParser());
        registry.registerParser(AANodeParserPlugin.PROMOTABLE_OPERATOR, () => new CallFunctionNodeParser());
        registry.registerParser(AANodeParserPlugin.PROJECT_POINT_TO_NAVIGATION, () => new GreenFunctionNodeParser());
    }

    nodeFriendlyNames = {
        'K2Node_BreakComplexFunctionParamValues': 'BreakAgencyFunctionParamValues',
    }
}
