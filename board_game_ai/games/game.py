import numpy as np
import itertools


class Game:
    def __init__(self, *, grid=None, rows=None, cols=None):
        if grid is None:
            if rows is None or cols is None:
                raise ValueError("if grid is none, rows and cols must be provided")
            self.grid = np.zeros((rows, cols), dtype=int)
        else:
            self.grid = grid.copy()

    def state_value(self, player):
        raise NotImplementedError

    def get_valid_moves(self, player):
        return [(row, col) for row, col in itertools.product(range(self.grid.shape[0]), range(self.grid.shape[1])) if self.is_valid_move(player, (row, col))]

    def is_termal_state(self):
        raise NotImplementedError

    def play_move(self, player, move):
        raise NotImplementedError

    def is_valid_move(self, player, move):
        raise NotImplementedError

    def draw(self, screen, player):
        raise NotImplementedError

    def reset(self):
        self.grid = np.zeros_like(self.grid)

    def copy(self):
        return self.__class__(grid=self.grid)

    def mouse_pos_to_cell_num(self, posx, posy, width, height):
        return int(posy * self.grid.shape[0] / height), int(posx * self.grid.shape[1] / width)
