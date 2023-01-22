import { AIPlayer } from "./ai-player.js";
import { PlayerType } from "../games/game.js";

export class MinimaxAI extends AIPlayer {
    selectBestMove(validMoves) {
        let bestValue = -1e8;
        let bestMove = validMoves[0];
        for (const move of validMoves) {
            const nextGame = this.manager.game.simulateMove(this.player, move);
            const value = this.minimax(nextGame, 0, false);
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
        return bestMove;
    }

    minimax(game, depth, isMax, alpha = -1e8, beta = 1e8) {
        const opponent = PlayerType.otherPlayer(this.player);
        const result = game.evaluate(this.player);
        if (result.leaf || depth >= game.maxDepth) {
            return result.score;
        }
        if (isMax) {
            let best = -1e8;
            for (const move of game.getValidMoves(this.player)) {
                const nextGame = game.simulateMove(this.player, move);
                best = Math.max(best, this.minimax(nextGame, depth + 1, !isMax, alpha, beta));
                alpha = Math.max(best, alpha);
                if (beta <= alpha) {
                    break;
                }
            }
            return best;
        } else {
            let best = 1e8;
            for (const move of game.getValidMoves(opponent)) {
                const nextGame = game.simulateMove(opponent, move);
                best = Math.min(best, this.minimax(nextGame, depth + 1, !isMax, alpha, beta));
                beta = Math.min(best, beta);
                if (beta <= alpha) {
                    break;
                }
            }
            return best;
        }
    }
}