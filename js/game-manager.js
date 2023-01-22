import { Tictactoe } from "./games/tictactoe.js";
import { Connect4 } from "./games/connect4.js";
import { fillSelect } from "./utils.js";
import { HumanPlayer } from "./players/human-player.js";
import { RandomAI } from "./players/ai-random.js";
import { MinimaxAI } from "./players/ai-minimax.js";
import { MonteCarloAI } from "./players/ai-monte-carlo.js";


export class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.selects = {
            game: document.querySelector("select#game"),
            player1: document.querySelector("select#player1"),
            player2: document.querySelector("select#player2")
        };
        this.options = {
            game: {
                "tictactoe": Tictactoe,
                "connect4": Connect4,
            },
            player: {
                "Human": HumanPlayer,
                "Random": RandomAI,
                "Minimax": MinimaxAI,
                "Monte Carlo": MonteCarloAI,
            }
        }
        fillSelect(this.selects.game, Object.keys(this.options.game));
        fillSelect(this.selects.player1, Object.keys(this.options.player));
        fillSelect(this.selects.player2, Object.keys(this.options.player));
        this.game = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.reset();
    }

    reset() {
        let id = window.setTimeout(() => { }, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        if (this.player1 !== undefined) {
            this.player1.reset();
        }
        if (this.player2 !== undefined) {
            this.player2.reset();
        }
        this.game = new this.options.game[this.selects.game.value](this.canvas, this.ctx);
        this.player1 = new this.options.player[this.selects.player1.value](1, this);
        this.player2 = new this.options.player[this.selects.player2.value](2, this);
    }

    registerPlayer1(player) {
        this.player1 = player;
    }

    registerPlayer2(player) {
        this.player2 = player;
    }

    play() {
        this.game.draw(0);
        this.player1.playTurn();
    }

    isValidMove(player, move) {
        return this.game.isValidMove(player, move);
    }

    getValidMoves(player) {
        return this.game.getValidMoves(player);
    }

    playMove(player, move) {
        this.game.playMove(player, move);
    }

    mouseToMove(x, y) {
        return this.game.mouseToMove(x, y);
    }

    finishTurn(player) {
        const result = this.game.evaluate(player);
        if (result.winner === 0) {
            if (player === 1) {
                this.player2.playTurn();
            }
            else if (player === 2) {
                this.player1.playTurn();
            }
        }
        this.game.draw(result.winner);
    }
}