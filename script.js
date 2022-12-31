// =========== Globals
const EMPTY = 0;
let PLAYER = 1;
let OPPONENT = 2;
// ===========

// =========== Selectors
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const gameSelect = document.querySelector("select#game");
const player1Select = document.querySelector("select#player1");
const player2Select = document.querySelector("select#player2");
const resetBtn = document.querySelector("div#reset-btn");
// ===========

// =========== Helpers
function drawMessage(text) {
    const fontsize = 120;
    ctx.font = `${fontsize}px Arial`;
    ctx.fillStyle = "#000000aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}
// ===========

// =========== Game
class Game {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        for(let row = 0;row < rows;row++) {
            this.grid.push([]);
            for(let col = 0;col < cols;col++) {
                this.grid[row].push(EMPTY);
            }
        }
        this.maxDepth = 1e8;
        this.type = Game;
    }
    simulateMove(player, move) {
        const nextGame = this.copy();
        nextGame.playMove(player, move);
        return nextGame;
    }
    copy() {
        const grid = [];
        for (let row = 0; row < this.rows; row++) {
            grid.push([]);
            for (let col = 0; col < this.cols; col++) {
                grid[row].push(this.grid[row][col]);
            }
        }
        // const nextGame = Object.create(this)
        // const nextGame = new Tictactoe(grid);
        const nextGame = new this.type(grid);
        return nextGame;
    }
    playMove(player, move) {}
    isValidMove(player, move) {}
    getValidMoves(player) {}
    evaluate(player) {}
    mouseToMove(x, y) {}
    draw(winner) {}
}
// ===========

// =========== Connect 4
class Connect4 extends Game {
    constructor(grid) {
        super(7, 7);
        this.maxDepth = 3;
        if (grid !== undefined) {
            this.grid = grid;
        }
        this.type = Connect4
    }
    playMove(player, move) {
        let row = 1;
        while(this.grid[row][move] === 0) {
            row++;
            if(row >= this.rows) {
                break;
            }
        }
        this.grid[row-1][move] = player;
    }
    isValidMove(player, move) {
        return this.grid[1][move] === 0;
    }
    getValidMoves(player) {
        const moves = [];
        for(let col = 0;col < this.cols;col++) {
            if(this.grid[1][col] === 0) {
                moves.push(col);
            }
        }
        return moves;
    }
    evaluate(player) {
        const opponent = player === PLAYER ? OPPONENT : PLAYER;
        // check 4's
        for(let row = 1;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                let ph = 0, pv = 0, pd1 = 0, pd2 = 0;
                let oh = 0, ov = 0, od1 = 0, od2 = 0;
                for(let i = 0;i < 4;i++) {
                    // horizontal
                    if(col <= this.cols - 4) {
                        if (this.grid[row][col + i] === player) {
                            ph++;
                        }
                        if (this.grid[row][col + i] === opponent) {
                            oh++;
                        }
                    }
                    // veritcal
                    if(row <= this.rows - 4) {
                        if (this.grid[row + i][col] === player) {
                            pv++;
                        }
                        if (this.grid[row + i][col] === opponent) {
                            ov++;
                        }
                    }
                    // diagonal 1
                    if(row <= this.rows - 4 && col <= this.cols - 4) {
                        if (this.grid[row + i][col + i] === player) {
                            pd1++;
                        }
                        if (this.grid[row + i][col + i] === opponent) {
                            od1++;
                        }
                    }
                    // diagonal 2
                    if(row <= this.rows - 4 && col >= 3) {
                        if(this.grid[row + i][col - i] === player) {
                            pd2++;
                        }
                        if(this.grid[row + i][col - i] === opponent) {
                            od2++;
                        }
                    }
                }
                if(ph === 4 || pv === 4 || pd1 === 4 || pd2 === 4) {
                    return {leaf: true, score: 10, winner: player};
                }
                if(oh === 4 || ov === 4 || od1 === 4 || od2 === 4) {
                    return {leaf: true, score: -10, winner: opponent};
                }
            }
        }
        if(this.getValidMoves(player).length === 0) {
            return {leaf: true, score: 0, winner: -1};
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

        return {leaf: false, score: 0, winner: 0};
     }
    mouseToMove(x, y) {
        const col = Math.floor(x / canvas.width * this.cols);
        return col;
     }
    draw(winner) {
        const padding = 20;
        ctx.fillStyle = "#282973";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cellWidth = canvas.width / this.cols;
        const cellHeight = canvas.height / this.rows;
        for(let row = 1;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                const x = cellWidth * col;
                const y = cellHeight * row;
                if(this.grid[row][col] === 1) {
                    ctx.fillStyle = "red";
                }
                else if(this.grid[row][col] === 2) {
                    ctx.fillStyle = "yellow";
                }
                else {
                    ctx.fillStyle = "white";
                }
                ctx.beginPath();
                ctx.arc(x + cellWidth / 2, y + cellHeight / 2, cellWidth / 2 - padding, 0, 360);
                ctx.fill();
            }
        }
        if(winner !== 0) {

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
            drawMessage(text);
        }
     }
}
// ===========

// =========== TicTacToe
class Tictactoe extends Game {
    constructor(grid) {
        super(3, 3);
        if (grid !== undefined) {
            this.grid = grid;
        }
        this.type = Tictactoe;
    }
    playMove(player, move) {
        this.grid[move.row][move.col] = player;
    }
    isValidMove(player, move) {
        return this.grid[move.row][move.col] === EMPTY;
    }
    getValidMoves(player) {
        const moves = [];
        for(let row = 0;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                const move = {row: row, col: col};
                if(this.isValidMove(player, move)) {
                    moves.push(move);
                }
            }
        }
        return moves;
    }
    evaluate(player) {
        const opponent = player == PLAYER ? OPPONENT : PLAYER;
        const checkPlayer = value => { return value === player };
        const checkOpponent = value => { return value === opponent };
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
        const row = Math.floor(y / canvas.height * this.rows);
        const col = Math.floor(x / canvas.width * this.cols);
        return {row: row, col: col};
    }
    draw(winner) {

        const cellWidth = canvas.width / this.cols;
        const cellHeight = canvas.height / this.rows;
        const padding = cellWidth / 4;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cellWidth/4, cellHeight);
        ctx.lineTo(cellWidth * 3 - cellWidth / 4, cellHeight);

        ctx.moveTo(cellWidth / 4, 2 * cellHeight);
        ctx.lineTo(cellWidth * 3 - cellWidth / 4, 2 * cellHeight);

        ctx.moveTo(cellWidth, cellHeight / 4);
        ctx.lineTo(cellWidth, cellHeight * 3 - cellHeight / 4);

        ctx.moveTo(cellWidth * 2, cellHeight / 4);
        ctx.lineTo(cellWidth * 2, cellHeight * 3 - cellHeight / 4);
        ctx.stroke();

        ctx.lineWidth = 50;

        for(let row = 0;row < this.rows;row++) {
            for(let col = 0;col < this.cols;col++) {
                const x = col * cellWidth;
                const y = row * cellHeight;

                if(this.grid[row][col] === 1) {
                    ctx.strokeStyle = "black";
                    ctx.beginPath();
                    ctx.moveTo(x + padding, y + padding);
                    ctx.lineTo(x + cellWidth - padding, y + cellHeight - padding);

                    ctx.moveTo(x + cellWidth - padding, y + padding);
                    ctx.lineTo(x + padding, y + cellHeight - padding);
                    ctx.stroke();
                }
                else if(this.grid[row][col] === 2) {
                    ctx.strokeStyle = "red";
                    ctx.beginPath();
                    ctx.arc(x + cellWidth /2 , y + cellHeight/ 2, cellWidth/2-padding, 0, 360);
                    ctx.stroke();
                }
            }
        }
        let text = "";
        if(winner === -1) {
            text = "Cat's Game!";
        }
        else if(winner === 1) {
            text = "X Wins!";
        }
        else if (winner === 2) {
            text = "O Wins!";
        }
        if(winner !== 0) {
            drawMessage(text);
        }
    }
}
// ===========


class GameManager {
    constructor() {
        this.game = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.reset();
    }

    reset() {
        let id = window.setTimeout(() => {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        if(this.player1 !== undefined) {
            this.player1.reset();
        }
        if(this.player2 !== undefined) {
            this.player2.reset();
        }
        this.game = new gameOptions[gameSelect.value]();
        this.player1 = new playerOptions[player1Select.value](1, this);
        this.player2 = new playerOptions[player2Select.value](2, this);
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
        console.log(result);
        if(result.winner === 0) {
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

class Player {
    constructor(player, manager) {
        this.player = player;
        this.manager = manager;
    }
    playTurn() {

    }
    finishTurn() {
        const self = this;
        setTimeout(() => {
            self.manager.finishTurn(self.player);
        }, 200);
    }
    reset() {}
}

class HumanPlayer extends Player {
    constructor(player, manager) {
        super(player, manager);
        const self = this;
        this.listener = (event) => {self.mouseEvent(event)};
    }

    playTurn() {
        canvas.addEventListener("click", this.listener);
    }

    reset() {
        canvas.removeEventListener("click", this.listener);
    }

    mouseEvent(event) {
        const rect = canvas.getBoundingClientRect();
        const rectWidth = rect.right - rect.left;
        const rectHeight = rect.bottom - rect.top;
        const ratioWidth = rectWidth / canvas.width;
        const ratioHeight = rectHeight / canvas.height;
        const x = (event.clientX - rect.left) / ratioWidth;
        const y = (event.clientY - rect.top) / ratioHeight;
        const move = this.manager.mouseToMove(x, y);
        if(!this.manager.isValidMove(this.player, move)) {
            return;
        }
        this.manager.playMove(this.player, move);
        this.myTurn = false;
        canvas.removeEventListener("click", this.listener);
        this.finishTurn();
    }
}

class AIPlayer extends Player {
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

class RandomAI extends AIPlayer {
    selectBestMove(validMoves) {
        const moveId = Math.floor(Math.random() * validMoves.length);
        return validMoves[moveId];
    }
}

class MinimaxAI extends AIPlayer {
    selectBestMove(validMoves) {
        let bestValue = -1e8;
        let bestMove = validMoves[0];
        for(const move of validMoves) {
            const nextGame = this.manager.game.simulateMove(this.player, move);
            const value = this.minimax(nextGame, 0, false);
            if(value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
        return bestMove;
    }

    minimax(game, depth, isMax, alpha=-1e8, beta=1e8) {
        const opponent = this.player === PLAYER ? OPPONENT : PLAYER;
        const result = game.evaluate(this.player);
        if(result.leaf || depth >= game.maxDepth) {
            return result.score;
        }
        if(isMax) {
            let best = -1e8;
            for(const move of game.getValidMoves(this.player)) {
                const nextGame = game.simulateMove(this.player, move);
                best = Math.max(best, this.minimax(nextGame, depth+1, !isMax, alpha, beta));
                alpha = Math.max(best, alpha);
                if(beta <= alpha) {
                    break;
                }
            }
            return best;
        } else {
            let best = 1e8;
            for(const move of game.getValidMoves(opponent)) {
                const nextGame = game.simulateMove(opponent, move);
                best = Math.min(best, this.minimax(nextGame, depth + 1, !isMax, alpha, beta));
                beta = Math.min(best, beta);
                if(beta <= alpha) {
                    break;
                }
            }
            return best;
        }
    }
}

const gameOptions = {
    "tictactoe": Tictactoe,
    "connect4": Connect4,
}

const playerOptions = {
    "human": HumanPlayer,
    "random": RandomAI,
    "minimax": MinimaxAI
}

function fillSelect(element, options) {
    for(const option of options) {
        const elem = document.createElement("option");
        elem.value = option;
        elem.innerHTML = option;
        element.appendChild(elem);
    }
}

function main() {
    fillSelect(gameSelect, Object.keys(gameOptions));
    fillSelect(player1Select, Object.keys(playerOptions));
    fillSelect(player2Select, Object.keys(playerOptions));
    const manager = new GameManager();
    const reset = () => {
        manager.reset();
        manager.play();
    }
    resetBtn.addEventListener("click", reset);
    gameSelect.addEventListener("change", reset);
    player1Select.addEventListener("change", reset);
    player2Select.addEventListener("change", reset);
    manager.play();
}

window.onload = main;
