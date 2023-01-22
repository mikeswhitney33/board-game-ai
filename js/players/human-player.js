import { Player } from "./player.js";

export class HumanPlayer extends Player {
    constructor(player, manager) {
        super(player, manager);
        this.canvas = this.manager.canvas;
        const self = this;
        this.listener = (event) => { self.mouseEvent(event) };
    }

    playTurn() {
        this.canvas.addEventListener("click", this.listener);
    }

    reset() {
        this.canvas.removeEventListener("click", this.listener);
    }

    mouseEvent(event) {
        const rect = this.canvas.getBoundingClientRect();
        const rectWidth = rect.right - rect.left;
        const rectHeight = rect.bottom - rect.top;
        const ratioWidth = rectWidth / this.canvas.width;
        const ratioHeight = rectHeight / this.canvas.height;
        const x = (event.clientX - rect.left) / ratioWidth;
        const y = (event.clientY - rect.top) / ratioHeight;
        const move = this.manager.mouseToMove(x, y);
        if (!this.manager.isValidMove(this.player, move)) {
            return;
        }
        this.manager.playMove(this.player, move);
        this.myTurn = false;
        this.canvas.removeEventListener("click", this.listener);
        this.finishTurn();
    }
}