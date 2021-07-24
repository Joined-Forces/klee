import { Canvas2D } from "./canvas";
import { Controller } from "./controller";
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
        this._controller = new Controller(element);

        this._parser = new BlueprintParser();
        const nodes = this._parser.parseBlueprint(element.innerHTML);

        Application._scene.load(nodes);
    }

    static get scene() {
        return this._scene;
    }
}
