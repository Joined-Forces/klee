import { Blueprint } from "./blueprint";

function initialize() {
    document.querySelectorAll('.ue-blueprint').forEach((canvas: HTMLCanvasElement) => {
        new Blueprint(canvas);
    });
}


window.addEventListener("load", initialize);