import {Player} from "./player.js";

export class AIPlayer extends Player {
    constructor(player, manager) {
        super(player, manager);
    }

    playTurn() {
        const validMoves = this.manager.getValidMoves(this.player);
        const move = this.selectBestMove(validMoves);
        this.manager.playMove(this.player, move);
        this.finishTurn();
    }

    selectBestMove(validMoves) {
        return validMoves[0];
    }
}