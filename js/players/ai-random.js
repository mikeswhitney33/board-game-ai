import { AIPlayer } from "./ai-player.js";

export class RandomAI extends AIPlayer {
    selectBestMove(validMoves) {
        const moveId = Math.floor(Math.random() * validMoves.length);
        return validMoves[moveId];
    }
}