import { AIPlayer } from "./ai-player.js";
import { PlayerType } from "../games/game.js";

export class MonteCarloAI extends AIPlayer {
    selectBestMove(validMoves) {
        let best = -1e8;
        let bestMove = validMoves[0];
        for(const move of validMoves) {
            const nextGame = this.manager.game.simulateMove(this.player, move);
            let numWins = 0;
            let numLosses = 0;
            for(let i = 0;i < 1000;i++) {
                numWins += this.simulateToEnd(nextGame);
                // if(this.simulateToEnd(nextGame)) {
                //     numWins++;
                // }
            }
            if (numWins > best) {
                best = numWins;
                bestMove = move;
            }
        }
        return bestMove;
    }

    simulateToEnd(game) {
        let player = PlayerType.otherPlayer(this.player);
        while(true) {
            const result = game.evaluate(this.player);
            if(result.leaf) {
                return result.score;
            }
            const validMoves = game.getValidMoves(player);
            const moveId = Math.floor(Math.random() * validMoves.length);
            game = game.simulateMove(player, validMoves[moveId]);
            player = PlayerType.otherPlayer(player);
        }
    }
}