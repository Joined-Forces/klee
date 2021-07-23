import { Blueprint } from "./blueprint";

function initialize() {
    document.querySelectorAll('canvas.ue-blueprint').forEach((canvas: HTMLCanvasElement) => {
        new Blueprint(canvas);
    });
}


window.addEventListener("load", initialize);