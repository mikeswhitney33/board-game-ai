from pygame import Surface
from board_game_ai.games.game import Game
import numpy as np
import pygame
from scipy.signal import convolve2d


class Connect4Game(Game):
    def __init__(self, *, grid=None):
        super().__init__(grid=grid, rows=7, cols=7)
        horiz = np.ones((1, 4), dtype=int)
        vert = np.transpose(horiz)
        diag = np.eye(4, dtype=int)
        diag0 = np.fliplr(diag)
        self.detection_kernels = [horiz, vert, diag, diag0]
        self.font = pygame.font.SysFont("serif", 32)

    def draw(self, screen: Surface, player):
        width, height = screen.get_size()
        cell_width = width // 7
        cell_height = height // 7
        screen.fill((0, 0, 255))
        for row in range(1, self.grid.shape[0]):
            for col in range(self.grid.shape[1]):
                if self.grid[row, col] == 0:
                    color = (255, 255, 255)
                elif self.grid[row, col] == 1:
                    color = (255, 255, 0)
                elif self.grid[row, col] == 2:
                    color = (255, 0, 0)
                pygame.draw.ellipse(screen, color, (col * cell_width + 3, row * cell_height + 3, cell_width - 6, cell_height - 6))
        if not self.is_termal_state():
            posx, posy = pygame.mouse.get_pos()
            row, col = self.mouse_pos_to_cell_num(posx, posy, width, height)
            color = (255, 0, 0) if player == 2 else (255, 255, 0)
            pygame.draw.ellipse(screen, color, (col * cell_width + 3, 3, cell_width - 6, cell_height - 6))
        else:
            if self.is_win(1):
                text = "Yellow Wins!"
                color = (255, 255, 0)
            elif self.is_win(2):
                text = "Red Wins!"
                color= (255, 0, 0)
            else:
                text = "Tie!"
                color= (255, 255, 255)
            text = self.font.render(text, False, color)
            text_width, text_height = text.get_size()
            screen.blit(text, (width // 2 - text_width // 2, text_height))

    def get_valid_moves(self, player):
        return [(1, col) for col in range(7) if self.grid[1, col] == 0]

    def state_value(self, player):
        if self.is_win(player):
            return 10
        elif self.is_win(1 if player == 2 else 2):
            return -10
        else:
            return 0

    def is_termal_state(self):
        return np.all(self.grid[1:] != 0) or self.is_win(1) or self.is_win(2)

    def is_win(self, player):
        mask = self.grid[1:] == player
        for kernel in self.detection_kernels:
            arr = convolve2d(mask, kernel, mode="valid")
            if (arr == 4).any():
                return True
        return False

    def is_valid_move(self, player, move):
        row, col = move
        return self.grid[1, col] == 0

    def play_move(self, player, move):
        row, col = move
        for i in range(1, self.grid.shape[0]):
            if self.grid[i, col] != 0:
                i -= 1
                break
        self.grid[i, col] = player
