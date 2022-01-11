

function main() {
    let canvas = document.getElementById("board");
    //constructor(canvas, n_rows, n_cols, line_color, line_thickness, primary_color, secondary_color, checkered)
    let board = new TicTacToe(canvas);
    board.draw();
}

window.onload = main;
