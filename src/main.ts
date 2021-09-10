import { Application } from "./application";

function initialize() {
    document.querySelectorAll('canvas.klee').forEach((canvas: HTMLCanvasElement) => {
        new Application(canvas);
    });
}

window.addEventListener("load", initialize);
