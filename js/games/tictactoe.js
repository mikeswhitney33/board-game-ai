import { Game, PlayerType } from "./game.js";
import { drawMessage } from "../utils.js";

export class Tictactoe extends Game {
    constructor(canvas, ctx, grid) {
        super(canvas, ctx, 3, 3);
        if (grid !== undefined) {
            this.grid = grid;
        }
        this.type = Tictactoe;
    }
    playMove(player, move) {
        this.grid[move.row][move.col] = player;
    }
    isValidMove(player, move) {
        return this.grid[move.row][move.col] === PlayerType.EMPTY;
    }
    getValidMoves(player) {
        const moves = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const move = { row: row, col: col };
                if (this.isValidMove(player, move)) {
                    moves.push(move);
                }
            }
        }
        return moves;
    }
    evaluate(player) {
        const opponent = player === PlayerType.PLAYER ? PlayerType.OPPONENT : PlayerType.PLAYER;
        const checkPlayer = value => value === player;
        const checkOpponent = value => value === opponent;
        for (let i = 0; i < 3; i++) {
            if (this.grid[i].every(checkPlayer)) {
                return { score: 10, leaf: true, winner: player };
            }
            else if (this.grid[i].every(checkOpponent)) {
                return { score: -10, leaf: true, winner: opponent };
            }
            const columns = [this.grid[0][i], this.grid[1][i], this.grid[2][i]];
            if (columns.every(checkPlayer)) {
                return { score: 10, leaf: true, winner: player };
            }
            else if (columns.every(checkOpponent)) {
                return { score: -10, leaf: true, winner: opponent };
            }
        }
        const diag1 = [this.grid[0][0], this.grid[1][1], this.grid[2][2]];
        if (diag1.every(checkPlayer)) {
            return { score: 10, leaf: true, winner: player };
        }
        else if (diag1.every(checkOpponent)) {
            return { score: -10, leaf: true, winner: opponent };
        }
        const diag2 = [this.grid[0][2], this.grid[1][1], this.grid[2][0]];
        if (diag2.every(checkPlayer)) {
            return { score: 10, leaf: true, winner: player };
        }
        else if (diag2.every(checkOpponent)) {
            return { score: -10, leaf: true, winner: opponent };
        }
        if (this.getValidMoves().length === 0) {
            return { score: 0, leaf: true, winner: -1 };
        }
        return { score: 0, leaf: false, winner: 0 };
    }
    mouseToMove(x, y) {
        const row = Math.floor(y / this.canvas.height * this.rows);
        const col = Math.floor(x / this.canvas.width * this.cols);
        return { row: row, col: col };
    }
    draw(winner) {

        const cellWidth = this.canvas.width / this.cols;
        const cellHeight = this.canvas.height / this.rows;
        const padding = cellWidth / 4;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cellWidth / 4, cellHeight);
        this.ctx.lineTo(cellWidth * 3 - cellWidth / 4, cellHeight);

        this.ctx.moveTo(cellWidth / 4, 2 * cellHeight);
        this.ctx.lineTo(cellWidth * 3 - cellWidth / 4, 2 * cellHeight);

        this.ctx.moveTo(cellWidth, cellHeight / 4);
        this.ctx.lineTo(cellWidth, cellHeight * 3 - cellHeight / 4);

        this.ctx.moveTo(cellWidth * 2, cellHeight / 4);
        this.ctx.lineTo(cellWidth * 2, cellHeight * 3 - cellHeight / 4);
        this.ctx.stroke();

        this.ctx.lineWidth = 50;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * cellWidth;
                const y = row * cellHeight;

                if (this.grid[row][col] === 1) {
                    this.ctx.strokeStyle = "black";
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + padding, y + padding);
                    this.ctx.lineTo(x + cellWidth - padding, y + cellHeight - padding);

                    this.ctx.moveTo(x + cellWidth - padding, y + padding);
                    this.ctx.lineTo(x + padding, y + cellHeight - padding);
                    this.ctx.stroke();
                }
                else if (this.grid[row][col] === 2) {
                    this.ctx.strokeStyle = "red";
                    this.ctx.beginPath();
                    this.ctx.arc(x + cellWidth / 2, y + cellHeight / 2, cellWidth / 2 - padding, 0, 360);
                    this.ctx.stroke();
                }
            }
        }
        let text = "";
        if (winner === -1) {
            text = "Cat's Game!";
        }
        else if (winner === 1) {
            text = "X Wins!";
        }
        else if (winner === 2) {
            text = "O Wins!";
        }
        if (winner !== 0) {
            drawMessage(this.canvas, this.ctx, text);
        }
    }
}