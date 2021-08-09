import { Application } from "./application";

function initialize() {
    document.querySelectorAll('canvas.ue-blueprint').forEach((canvas: HTMLCanvasElement) => {
        new Application(canvas);
    });
}

window.addEventListener("load", initialize);
