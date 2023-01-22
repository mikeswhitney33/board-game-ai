import { Game, PlayerType } from "./game.js";
import { drawMessage } from "../utils.js";

export class Connect4 extends Game {
    constructor(canvas, ctx, grid) {
        super(canvas, ctx, 7, 7);
        this.maxDepth = 3;
        if (grid !== undefined) {
            this.grid = grid;
        }
        this.type = Connect4
    }
    playMove(player, move) {
        let row = 1;
        while (this.grid[row][move] === 0) {
            row++;
            if (row >= this.rows) {
                break;
            }
        }
        this.grid[row - 1][move] = player;
    }
    isValidMove(player, move) {
        return this.grid[1][move] === 0;
    }
    getValidMoves(player) {
        const moves = [];
        for (let col = 0; col < this.cols; col++) {
            if (this.grid[1][col] === 0) {
                moves.push(col);
            }
        }
        return moves;
    }
    evaluate(player) {
        const opponent = player === PlayerType.PLAYER ? PlayerType.OPPONENT : PlayerType.PLAYER;
        // check 4's
        for (let row = 1; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let ph = 0, pv = 0, pd1 = 0, pd2 = 0;
                let oh = 0, ov = 0, od1 = 0, od2 = 0;
                for (let i = 0; i < 4; i++) {
                    // horizontal
                    if (col <= this.cols - 4) {
                        if (this.grid[row][col + i] === player) {
                            ph++;
                        }
                        if (this.grid[row][col + i] === opponent) {
                            oh++;
                        }
                    }
                    // veritcal
                    if (row <= this.rows - 4) {
                        if (this.grid[row + i][col] === player) {
                            pv++;
                        }
                        if (this.grid[row + i][col] === opponent) {
                            ov++;
                        }
                    }
                    // diagonal 1
                    if (row <= this.rows - 4 && col <= this.cols - 4) {
                        if (this.grid[row + i][col + i] === player) {
                            pd1++;
                        }
                        if (this.grid[row + i][col + i] === opponent) {
                            od1++;
                        }
                    }
                    // diagonal 2
                    if (row <= this.rows - 4 && col >= 3) {
                        if (this.grid[row + i][col - i] === player) {
                            pd2++;
                        }
                        if (this.grid[row + i][col - i] === opponent) {
                            od2++;
                        }
                    }
                }
                if (ph === 4 || pv === 4 || pd1 === 4 || pd2 === 4) {
                    return { leaf: true, score: 10, winner: player };
                }
                if (oh === 4 || ov === 4 || od1 === 4 || od2 === 4) {
                    return { leaf: true, score: -10, winner: opponent };
                }
            }
        }
        if (this.getValidMoves(player).length === 0) {
            return { leaf: true, score: 0, winner: -1 };
        }
        for (let row = 1; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let ph = 0, pv = 0, pd1 = 0, pd2 = 0;
                let oh = 0, ov = 0, od1 = 0, od2 = 0;
                for (let i = 0; i < 3; i++) {
                    // horizontal
                    if (col < this.cols - 3) {
                        if (this.grid[row][col + i] === player) {
                            ph++;
                        }
                        if (this.grid[row][col + i] === opponent) {
                            oh++;
                        }
                    }
                    // veritcal
                    if (row <= this.rows - 3) {
                        if (this.grid[row + i][col] === player) {
                            pv++;
                        }
                        if (this.grid[row + i][col] === opponent) {
                            ov++;
                        }
                    }
                    // diagonal 1
                    if (row <= this.rows - 3 && col < this.cols - 3) {
                        if (this.grid[row + i][col + i] === player) {
                            pd1++;
                        }
                        if (this.grid[row + i][col + i] === opponent) {
                            od1++;
                        }
                    }
                    // diagonal 2
                    if (row <= this.rows - 3 && col >= 2) {
                        if (this.grid[row + i][col - i] === player) {
                            pd2++;
                        }
                        if (this.grid[row + i][col - i] === opponent) {
                            od2++;
                        }
                    }
                }
                if (ph === 3 || pv === 3 || pd1 === 3 || pd2 === 3) {
                    return { leaf: false, score: 3, winner: 0 };
                }
                if (oh === 3 || ov === 3 || od1 === 3 || od2 === 3) {
                    return { leaf: false, score: -3, winner: 0 };
                }
            }
        }

        return { leaf: false, score: 0, winner: 0 };
    }
    mouseToMove(x, y) {
        const col = Math.floor(x / this.canvas.width * this.cols);
        return col;
    }
    draw(winner) {
        const padding = 20;
        this.ctx.fillStyle = "#282973";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const cellWidth = this.canvas.width / this.cols;
        const cellHeight = this.canvas.height / this.rows;
        for (let row = 1; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = cellWidth * col;
                const y = cellHeight * row;
                if (this.grid[row][col] === 1) {
                    this.ctx.fillStyle = "red";
                }
                else if (this.grid[row][col] === 2) {
                    this.ctx.fillStyle = "yellow";
                }
                else {
                    this.ctx.fillStyle = "white";
                }
                this.ctx.beginPath();
                this.ctx.arc(x + cellWidth / 2, y + cellHeight / 2, cellWidth / 2 - padding, 0, 360);
                this.ctx.fill();
            }
        }
        if (winner !== 0) {

            let text = "";
            if (winner === -1) {
                text = "Cat's Game!";
            }
            else if (winner === 1) {
                text = "Red Wins!";
            }
            else if (winner === 2) {
                text = "Yellow Wins!";
            }
            drawMessage(this.canvas, this.ctx, text);
        }
    }
}