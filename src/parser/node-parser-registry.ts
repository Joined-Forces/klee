import { UnrealNodeClass } from "../data/classes/unreal-node-class";
import { NodeFriendlyNames } from "./node-friendly-names";
import { NodeParser } from "./node.parser";
import * as fs from 'fs';
import * as path from 'path';

export interface NodeParserPlugin {
    registerNodeParsers: () => void;
    nodeFriendlyNames: { [name: string]: string };
}

export class NodeParserRegistry {
    private static readonly PLUGINS_DIR = path.join(__dirname, '../plugins');

    private static instance: NodeParserRegistry;
    private parsers: Map<UnrealNodeClass, () => NodeParser> = new Map();
    private pluginsLoaded: boolean = false;

    private constructor() {}

    public static getInstance(): NodeParserRegistry {
        if (!NodeParserRegistry.instance) {
            NodeParserRegistry.instance = new NodeParserRegistry();
        }
        return NodeParserRegistry.instance;
    }

    public autoLoadPlugins(): void {
        if (this.pluginsLoaded) return;

        try {
            this.loadPlugins();
            console.info("Auto-loaded plugins successfully");
        } catch (error) {
            console.warn("Could not auto-load plugins:", error);
        }
        this.pluginsLoaded = true;
    }

    private loadPlugins(): void {
        if (!fs.existsSync(NodeParserRegistry.PLUGINS_DIR)) {
            console.debug("No plugins directory found");
            return;
        }

        const pluginFiles = fs.readdirSync(NodeParserRegistry.PLUGINS_DIR)
            .filter((file: string) => file.endsWith('.ts'))
            .filter((file: string) => !file.endsWith('.d.ts'));

        console.info(`Found ${pluginFiles.length} plugin files:`, pluginFiles);

        for (const pluginFile of pluginFiles) {
            this.loadPlugin(pluginFile);
        }
    }

    private loadPlugin(pluginFile: string): void {
        const pluginPath = path.join(NodeParserRegistry.PLUGINS_DIR, pluginFile);
        const pluginModulePath = pluginPath.replace(/\.ts$/, '');
        
        let pluginModule;
        try {
            pluginModule = require(pluginModulePath);
        } catch (error) {
            console.warn(`Failed to load plugin module ${pluginFile}:`, error.message);
            return;
        }

        const registerFunction = pluginModule["registerNodeParsers"];
        if (typeof registerFunction === 'function') {
            try {
                registerFunction();
            } catch (error) {
                console.error(`Error executing ${registerFunction}() in plugin ${pluginFile}:`, error.message);
            }
        }

        const nodeFriendlyNames = pluginModule["nodeFriendlyNames"];
        if (nodeFriendlyNames && typeof nodeFriendlyNames === 'object') {
            try {
                for (const [key, value] of Object.entries(nodeFriendlyNames)) {
                    NodeFriendlyNames[key] = value as string;
                }
            } catch (error) {
                console.error(`Error loading friendly names from ${pluginFile}:`, error.message);
            }
        }
    }

    public registerParser(nodeClass: UnrealNodeClass, parserFactory: () => NodeParser): void {
        this.parsers.set(nodeClass, parserFactory);
    }

    public getParser(nodeClass: UnrealNodeClass): (() => NodeParser) | undefined {
        return this.parsers.get(nodeClass);
    }
} 