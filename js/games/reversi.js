import { PlayerType, Game } from "./game.js";
import { drawMessage } from "../utils.js";

export class Reversi extends Game {
    constructor(canvas, ctx, grid) {
        super(canvas, ctx, 8, 8);
        this.maxDepth = 3;
        if (grid !== undefined) {
            this.grid = grid;
        }
        this.type = Reversi;
    }
    playDirection(player, move, srow, scol) {
        if(this.get(move) === player) {
            return;
        }
        this.set(move, player);
        const nextMove = this.next(move, srow, scol);
        this.playDirection(player, nextMove, srow, scol);
    }
    playMove(player, move) {
        console.log(move);
        this.set(move, player);
        if(this.isMiddleFour(move)) {
            return;
        }
        const opponent = PlayerType.otherPlayer(player);
        for(let srow = -1;srow < 2;srow++) {
            for(let scol = -1;scol < 2;scol++) {
                if(srow === 0 && scol === 0) {
                    continue;
                }
                const nextMove = this.next(move, srow, scol);
                if(!this.inBounds(nextMove)) {
                    continue;
                }
                if(this.get(nextMove) !== opponent) {
                    continue;
                }
                if(this.checkDirection(player, nextMove, srow, scol)) {
                    this.playDirection(player, nextMove, srow, scol);
                }
            }
        }
    }
    checkDirection(player, move, srow, scol) {
        if(!this.inBounds(move)) {
            return false;
        }
        if(this.get(move) === PlayerType.EMPTY) {
            return false;
        }
        if(this.get(move) === PlayerType.otherPlayer(player)) {
            return this.checkDirection(player, this.next(move, srow, scol), srow, scol);
        }
        return true;
    }
    inBounds(move) {
        return move.row >= 0 && move.row < this.rows && move.col >= 0 && move.col < this.cols;
    }
    next(move, srow, scol) {
        return {
            row: move.row + srow,
            col: move.col + scol
        }
    }
    get(move) {
        return this.grid[move.row][move.col];
    }
    set(move, value) {
        this.grid[move.row][move.col] = value;
    }
    isMiddleFour(move) {
        return (move.row == 3 && move.col == 3) ||
            (move.row == 3 && move.col == 4) ||
            (move.row == 4 && move.col == 3) ||
            (move.row == 4 && move.col == 4);
    }
    firstFour() {
        return this.get({row:3, col:3}) !== PlayerType.EMPTY &&
            this.get({ row: 3, col: 4 }) !== PlayerType.EMPTY &&
            this.get({ row: 4, col: 3 }) !== PlayerType.EMPTY &&
            this.get({ row: 4, col: 4 }) !== PlayerType.EMPTY;
    }
    isValidMove(player, move) {
        if(this.get(move) !== PlayerType.EMPTY) {
            return false;
        }
        if(!this.firstFour()) {
            return this.isMiddleFour(move);
        }
        const opponent = PlayerType.otherPlayer(player);
        for(let srow = -1;srow < 2;srow++) {
            for(let scol = -1;scol < 2;scol++) {
                if(srow === 0 && scol === 0) {
                    continue;
                }
                const nextMove = this.next(move, srow, scol);
                if(!this.inBounds(nextMove)) {
                    continue;
                }
                if(this.get(nextMove) !== opponent) {
                    continue;
                }
                if(this.checkDirection(player, {row:move.row + srow, col:move.col+scol}, srow, scol)) {
                    return true;
                }
            }
        }
        return false;
    }
    getValidMoves(player) {
        const validMoves = [];
        for(let row = 0;row < this.rows;row++){
            for(let col = 0;col < this.cols;col++){
                const move = {row, col};
                if(this.isValidMove(player, move)) {
                    validMoves.push(move);
                }
            }
        }
        return validMoves;
    }
    evaluate(player) {
        let opponent = PlayerType.otherPlayer(player);
        let playerScore = 0;
        let opponentScore = 0;
        for(let row = 0;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                const val = this.get({row, col});
                if(val === player) {
                    playerScore++;
                }
                if(val === opponent) {
                    opponentScore++;
                }
            }
        }
        let leaf = false;
        let winner = 0;
        let nextPlayer = opponent;
        const score = playerScore / opponentScore;
        const opponentValidMoves = this.getValidMoves(opponent);
        if(opponentValidMoves.length === 0) {
            nextPlayer = player;
            const playerValidMoves = this.getValidMoves(player);
            if(playerValidMoves.length === 0) {
                leaf = true;
                if(playerScore > opponentScore) {
                    winner = player;
                }
                else if(opponentScore > playerScore) {
                    winner = opponent;
                }
                else {
                    winner = -1;
                }
            }
        }
        return {leaf, score, winner, nextPlayer};
    }
    mouseToMove(x, y) {
        const row = Math.floor(y / this.canvas.height * this.rows);
        const col = Math.floor(x / this.canvas.width * this.cols);
        return { row: row, col: col };
    }
    draw(winner, player) {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cellWidth = this.canvas.width / this.cols;
        const cellHeight = this.canvas.height / this.rows;
        const padding = cellWidth / 4;

        for(let i = 1;i < 8;i++) {
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(cellWidth * i, padding);
            this.ctx.lineTo(cellWidth * i, this.canvas.height - padding);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(padding, cellHeight * i);
            this.ctx.lineTo(this.canvas.width - padding, cellHeight * i);
            this.ctx.stroke();
        }

        for(let row = 0;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                if(this.grid[row][col] !== PlayerType.EMPTY) {
                    this.ctx.fillStyle = this.grid[row][col] === PlayerType.PLAYER ? "white" : "black";
                    this.ctx.beginPath();
                    this.ctx.arc(col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2, cellWidth / 2 - padding, 0, 360);
                    this.ctx.fill();
                }
            }
        }

        if(typeof player !== "undefined") {
            const validMoves = this.getValidMoves(player);
            this.ctx.strokeStyle = "red";
            this.ctx.lineWidth = 3;
            for (const move of validMoves) {
                this.ctx.strokeRect(move.col * cellWidth, move.row * cellHeight, cellWidth, cellHeight);
            }
        }

        if(winner !== 0) {
            let text;
            if(winner === PlayerType.PLAYER) {
                text = "White Wins!";
            }
            else if(winner === PlayerType.OPPONENT) {
                text = "Black Wins!";
            }
            else {
                text = "Tie Game!";
            }
            drawMessage(this.canvas, this.ctx, text);
        }
    }
}