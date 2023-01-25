export class PlayerType {
    static EMPTY = 0;
    static PLAYER = 1;
    static OPPONENT = 2;

    static otherPlayer(player) {
        return player === this.PLAYER ? this.OPPONENT : this.PLAYER;
    }
};

export class Game {
    constructor(canvas, ctx, rows, cols) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        for (let row = 0; row < rows; row++) {
            this.grid.push([]);
            for (let col = 0; col < cols; col++) {
                this.grid[row].push(PlayerType.EMPTY);
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
        const nextGame = new this.type(this.canvas, this.ctx, grid);
        return nextGame;
    }
    playMove(player, move) { }
    isValidMove(player, move) { }
    getValidMoves(player) { }
    evaluate(player) { }
    mouseToMove(x, y) { }
    draw(winner, player) { }
}