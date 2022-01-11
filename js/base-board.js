


class BaseBoard {
    constructor(canvas, n_rows, n_cols, line_color, line_thickness, primary_color, secondary_color, checkered) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.line_color = line_color;
        this.line_thickness = line_thickness;
        this.primary_color = primary_color;
        this.secondary_color = secondary_color;
        this.box_width = Math.ceil(this.canvas.width / this.n_cols);
        this.box_height = Math.ceil(this.canvas.height / this.n_rows);
    }

    draw_line(x1, y1, x2, y2, color, thickness)
    {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = thickness;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    index_to_coords(idx) {
        const row = idx % 3;
        const col = Math.floor(idx / 3);
        return [row, col];
    }

    coords_to_index(row, col) {
        return row * this.n_cols + col;
    }

    draw_piece(row, col) {

    }

    draw() {
        let color = this.primary_color;

        for(let row = 0;row < this.n_rows;row++)
        {
            for(let col = 0;col < this.n_cols;col++)
            {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(col * this.box_width, row * this.box_height, this.box_width, this.box_height);

                if(col == this.n_cols-1 && this.n_cols % 2 == 0) {
                    continue;
                }
                color = color == this.primary_color ? this.secondary_color : this.primary_color;
                this.draw_piece(row, col);
            }
        }
        if(this.line_thickness != 0)
        {
            for(let row = 1;row < this.n_rows;row++) {
                this.draw_line(0, row * this.box_height, this.canvas.width, row * this.box_height, this.line_color, this.line_thickness);
            }
            for (let col = 1; col < this.n_cols; col++) {
                this.draw_line(col * this.box_width, 0, col * this.box_width, this.canvas.height, this.line_color, this.line_thickness);
            }
        }
    }
}