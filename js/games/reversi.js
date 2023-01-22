import { PlayerType, Game } from "./game.js";

export class Reversi extends Game {
    constructor(canvas, ctx, grid) {
        super(canvas, ctx, 8, 8);
        this.maxDepth = 3;
        this.turn = 0;
        if (grid !== undefined) {
            this.grid = grid;
            for(let row = 0;row < this.rows;row++) {
                for(let col = 0;col < this.cols;col++) {
                    if(this.grid[row][col] !== PlayerType.EMPTY) {
                        this.turn++;
                    }
                }
            }
        }
        this.type = Reversi;
    }
    playMove(player, move) {
        this.turn++;
    }
    isValidMove(player, move) {
        if(this.grid[move.row][move.col] !== PlayerType.EMPTY) {
            return false;
        }
    }
    getValidMoves(player) {
        const validMoves = [];
        if(this.turn < 4) {
            if (this.grid[3][3] !== PlayerType.EMPTY) {
                validMoves.push({row: 3, col: 3});
            }
            if (this.grid[4][3] !== PlayerType.EMPTY) {
                validMoves.push({ row: 4, col: 3 });
            }
            if (this.grid[3][4] !== PlayerType.EMPTY) {
                validMoves.push({ row: 3, col: 4 });
            }
            if (this.grid[4][4] !== PlayerType.EMPTY) {
                validMoves.push({ row: 4, col: 4 });
            }
        }
        else {
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const move = { row: row, col: col };
                    if (this.isValidMove(player, move)) {
                        validMoves.push(move);
                    }
                }
            }
        }
        return validMoves;
    }
    evaluate(player) { }
    mouseToMove(x, y) { }
    draw(winner) {
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
    }
}