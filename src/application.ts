import { Canvas2D } from "./canvas";
import { Controller } from "./controller";
import { BlueprintParser } from "./parser/blueprint-parser";
import { Scene } from "./scene";

export class Application {

    private _scene: Scene;
    private _canvas: Canvas2D;

    private _controller: Controller;
    private _parser: BlueprintParser;
    private _element: HTMLCanvasElement;

    private static firefox: boolean;

    private allowPaste: boolean;

    constructor(element: HTMLCanvasElement) {

        this._element = element;

        if (navigator.userAgent.indexOf("Firefox") > 0) {
            Application.firefox = true;
        }

        this._canvas = new Canvas2D(element);
        this._scene = new Scene(this._canvas, this);

        this.initializeHtmlAttributes();

        this._parser = new BlueprintParser();
        this.loadBlueprintIntoScene(element.innerHTML);

        this._controller = new Controller(element, this);
        this._controller.registerAction({
            ctrl: true,
            keycode: 'KeyC',
            callback: this.copyBlueprintSelectionToClipboard.bind(this)
        });
        this._controller.registerAction({
            ctrl: false,
            keycode: 'Home',
            callback: this.recenterCamera.bind(this),
        })

        if (this.allowPaste) {
            this._controller.registerAction({
                ctrl: true,
                keycode: 'KeyV',
                callback: this.pasteClipboardContentToCanvas.bind(this)
            });
            this._element.onpaste = (ev) => this.onPaste(ev);
        }

        window.addEventListener('resize', this.refresh.bind(this), false);
    }

    get scene() {
        return this._scene;
    }

    get canvas() {
        return this._canvas;
    }

    static get isFirefox() {
        return this.firefox;
    }

    private initializeHtmlAttributes() {
        this._element.style.outline = 'none';

        let attrPaste = this._element.getAttributeNode("data-klee-paste");
        this.allowPaste = attrPaste?.value == "true" || false;
    }

    public refresh() {
        this._element.width = this._element.offsetWidth;
        this._element.height = this._element.offsetHeight;
        this._scene.collectInteractables();
        this._scene.updateLayout();
        this._scene.refresh();
    }

    private copyBlueprintSelectionToClipboard() {
        console.log("Copy selection");

        let textLines = [];
        this._scene.nodes.filter(n => n.selected).forEach(n => textLines = [].concat(textLines, n.sourceText));
        navigator.clipboard.writeText(textLines.join('\n'));

        return true;
    }

    private pasteClipboardContentToCanvas(ev) {
        if (!this.allowPaste) return;
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
        if (!this.allowPaste) return;
        console.log("Paste from clipboard");
        let text = ev.clipboardData.getData("text/plain");
        this.loadBlueprintIntoScene(text);
    }

    private loadBlueprintIntoScene(text) {
        this._scene.unload();
        const nodes = this._parser.parseBlueprint(text);
        this._scene.load(nodes);
        this.refresh();

        this.recenterCamera();
        
    }

    recenterCamera() {
        // Move camera to the center of all nodes
        this._scene.camera.centerAbsolutePosition(this._scene.calculateCenterPoint());
        this.refresh();
        return true;
    }
}
