import { Canvas2D } from "./canvas";
import { Controller } from "./controller";
import { BlueprintParser } from "./parser/blueprint-parser";
import { Scene } from "./scene";

export class Application {

    private static _scene: Scene;
    private static _canvas: Canvas2D;

    private _controller: Controller;
    private _parser: BlueprintParser;
    private _element: HTMLCanvasElement;

    private static firefox: boolean;

    constructor(element: HTMLCanvasElement) {

        this._element = element;

        if (navigator.userAgent.indexOf("Firefox") > 0) {
            Application.firefox = true;
        }

        Application._canvas = new Canvas2D(element);
        Application._scene = new Scene(Application._canvas);

        this.initializeHtmlAttributes();
        //this.refresh();

        this._parser = new BlueprintParser();
        this.loadBlueprintIntoScene(element.innerHTML);

        this._controller = new Controller(element);
        this._controller.registerAction({
            ctrl: true,
            keycode: 'KeyC',
            callback: this.copyBlueprintSelectionToClipboard.bind(this)
        });
        this._controller.registerAction({
            ctrl: true,
            keycode: 'KeyV',
            callback: this.pasteClipboardContentToCanvas.bind(this)
        });
        this._controller.registerAction({
            ctrl: false,
            keycode: 'Home',
            callback: this.recenterCamera.bind(this),
        })

        this._element.onpaste = (ev) => this.onPaste(ev);

        window.addEventListener('resize', this.refresh.bind(this), false);

        //this.refresh();
    }

    static get scene() {
        return this._scene;
    }

    static get canvas() {
        return this._canvas;
    }

    static get isFirefox() {
        return this.firefox;
    }

    private initializeHtmlAttributes() {
        this._element.style.width = '100%';
        this._element.style.minHeight = '600px';
        this._element.style.outline = 'none';
    }

    public refresh() {
        this._element.width = this._element.offsetWidth;
        this._element.height = this._element.offsetHeight;
        Application._scene.collectInteractables();
        Application._scene.updateLayout();
        Application._scene.refresh();
    }

    private copyBlueprintSelectionToClipboard() {
        console.log("Copy selection");

        let textLines = [];
        Application._scene.nodes.filter(n => n.selected).forEach(n => textLines = [].concat(textLines, n.sourceText));
        navigator.clipboard.writeText(textLines.join('\n'));

        return true;
    }

    private pasteClipboardContentToCanvas(ev) {
        if (Application.isFirefox) {
            return false;
        }

        console.log("Paste from clipboard");

        navigator.clipboard.readText().then((text) => {
            if(!text) return;
            this.loadBlueprintIntoScene(text);
        });

        return true;
    }

    private onPaste(ev) {
        console.log("Paste from clipboard");
        let text = ev.clipboardData.getData("text/plain");
        this.loadBlueprintIntoScene(text);
    }

    private loadBlueprintIntoScene(text) {
        Application._scene.unload();
        const nodes = this._parser.parseBlueprint(text);
        Application._scene.load(nodes);
        //Application._scene.refresh();

        this.recenterCamera();
        
    }

    recenterCamera() {
        // Move camera to the center of all nodes
        this.refresh();
        Application._scene.camera.centreAbsolutePosition(Application._scene.calculateCentroid());
        this.refresh();
        return true;
    }
}
