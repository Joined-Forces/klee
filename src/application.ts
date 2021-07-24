import { Canvas2D } from "./canvas";
import { Controller, UserAction } from "./controller";
import { BlueprintParser } from "./parser/blueprint-parser";
import { Scene } from "./scene";

export class Application {

    private static _scene: Scene;

    private _controller: Controller;
    private _canvas: Canvas2D;
    private _parser: BlueprintParser;

    constructor(element: HTMLCanvasElement) {

        this._canvas = new Canvas2D(element);
        Application._scene = new Scene(this._canvas);

        this._parser = new BlueprintParser();
        this.loadBlueprintIntoScene(element.innerHTML);

        this._controller = new Controller(element);
        this._controller.registerAction(UserAction.Copy, this.copyBlueprintSelectionToClipboard.bind(this));
        this._controller.registerAction(UserAction.Paste, this.pasteClipboardContentToCanvas.bind(this));
    }

    static get scene() {
        return this._scene;
    }

    private copyBlueprintSelectionToClipboard() {
        console.log("Copy selection");
        navigator.clipboard.writeText('');
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
