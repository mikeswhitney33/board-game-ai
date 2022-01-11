

class TicTacToe extends BaseBoard {
    constructor(canvas) {
        super(canvas, 3, 3, "black", 30, "white", "white");
        this.items = [0,0,0,0,0,0,0,0,0];
    }

    draw_piece(row, col)
    {
        const i = row * this.n_cols + col;
        if (this.items[i] == 1) {
            this.draw_line(col * this.box_width + 30, row * this.box_height + 30, (col + 1) * this.box_width - 30, (row + 1) * this.box_height - 30, this.line_color, this.line_thickness);
            this.draw_line((col + 1) * this.box_width - 30, row * this.box_height + 30, col * this.box_width + 30, (row + 1) * this.box_height - 30, this.line_color, this.line_thickness);
        }
        if (this.items[i] == -1) {
            this.ctx.lineWidth = this.line_thickness;
            this.ctx.beginPath();
            this.ctx.arc(col * this.box_width + Math.floor(this.box_width / 2), row * this.box_height + Math.floor(this.box_height / 2), Math.floor(this.box_width / 2) - 42, 0, 360);
            this.ctx.stroke();
        }
    }
}