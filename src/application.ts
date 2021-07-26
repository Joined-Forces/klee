import { Canvas2D } from "./canvas";
import { Controller, UserAction } from "./controller";
import { BlueprintParser } from "./parser/blueprint-parser";
import { Scene } from "./scene";

export class Application {

    private static _scene: Scene;
    private static _canvas: Canvas2D;

    private _controller: Controller;
    private _parser: BlueprintParser;

    constructor(element: HTMLCanvasElement) {

        Application._canvas = new Canvas2D(element);
        Application._scene = new Scene(Application._canvas);

        this._parser = new BlueprintParser();
        this.loadBlueprintIntoScene(element.innerHTML);

        this._controller = new Controller(element);
        this._controller.registerAction(UserAction.Copy, this.copyBlueprintSelectionToClipboard.bind(this));
        this._controller.registerAction(UserAction.Paste, this.pasteClipboardContentToCanvas.bind(this));
    }

    static get scene() {
        return this._scene;
    }

    static get canvas() {
        return this._canvas;
    }

    private copyBlueprintSelectionToClipboard() {
        console.log("Copy selection");

        let textLines = [];
        Application._scene.nodes.filter(n => n.selected).forEach(n => textLines = [].concat(textLines, n.node.sourceText));
        navigator.clipboard.writeText(textLines.join('\n'));
    }

    private pasteClipboardContentToCanvas() {
        console.log("Paste from clipboard");

        navigator.clipboard.readText().then((text) => {
            if(!text) return;
            this.loadBlueprintIntoScene(text);
        });
    }

    private loadBlueprintIntoScene(text) {
        const nodes = this._parser.parseBlueprint(text);
        Application._scene.load(nodes);
    }
}
