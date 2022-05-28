from board_game_ai.games.game import Game
import numpy as np
import pygame


class OthelloGame(Game):
    def __init__(self, *, grid=None):
        super().__init__(grid=grid, rows=8, cols=8)
        self.font = pygame.font.SysFont("serif", 50)

    def state_value(self, player):
        other_player = 2 if player == 1 else 1
        return np.sum(self.grid == player) - np.sum(self.grid == other_player)

    def draw(self, screen, player):
        width, height = screen.get_size()
        screen.fill((0, 255, 0))
        cell_width = width // 8
        cell_height = height // 8
        for i in range(1, 8):
            pygame.draw.line(screen, (0, 0, 0), (i * cell_width, 0), (i * cell_width, height))
            pygame.draw.line(screen, (0, 0, 0), (0, i * cell_height), (width, i * cell_height))

        for row in range(self.grid.shape[0]):
            for col in range(self.grid.shape[1]):
                if self.is_valid_move(player, (row, col)):
                    color = (255, 255, 255) if player == 1 else (0, 0, 0)
                    pygame.draw.rect(screen, color, (col * cell_width, row * cell_height, cell_width, cell_height), 3)
                elif self.grid[row, col] == 1:
                    pygame.draw.ellipse(screen, (255, 255, 255), (col * cell_width + 3, row * cell_height + 3, cell_width - 6, cell_height - 6))
                elif self.grid[row, col] == 2:
                    pygame.draw.ellipse(screen, (0, 0, 0), (col * cell_width + 3, row * cell_height + 3, cell_width - 6, cell_height - 6))
        if self.is_termal_state():
            white_score = np.sum(self.grid == 1)
            black_score = np.sum(self.grid == 2)
            if white_score == black_score:
                text = "Tie"
            elif white_score > black_score:
                text = f"White wins ({white_score} - {black_score})"
            else:
                text = f"Black wins ({black_score} - {white_score})"
            text = self.font.render(text, False, (255, 0, 0))
            text_width, text_height = text.get_size()
            screen.blit(text, (width // 2 - text_width // 2, height // 2 - text_height // 2))

    def is_termal_state(self):
        return not np.any(self.grid == 0) or (not self.get_valid_moves(1) and not self.get_valid_moves(2))

    def in_bounds(self, row, col):
        return row >= 0 and row < self.grid.shape[0] and col >= 0 and col < self.grid.shape[1]

    def is_valid_move(self, player, move):
        row, col = move
        if self.grid[row, col] != 0:
            return False
        turn = np.sum(self.grid != 0)
        if turn < 4:
            return self.grid[row, col] == 0 and row in (3, 4) and col in (3, 4)
        other_player = 2 if player == 1 else 1
        for srow in range(-1, 2):
            for scol in range(-1, 2):
                if srow == 0 and scol == 0:
                    continue
                nrow = row + srow
                ncol = col + scol
                if not self.in_bounds(nrow, ncol):
                    continue
                if self.grid[nrow, ncol] == player:
                    continue
                if self.grid[nrow, ncol] == 0:
                    continue
                if self.grid[nrow, ncol] == other_player and self.is_run_valid(player, nrow, ncol, srow, scol):
                    return True
        return False

    def is_run_valid(self, player, row, col, srow, scol):
        if not self.in_bounds(row, col) or self.grid[row, col] == 0:
            return False
        if self.grid[row, col] == player:
            return True
        return self.is_run_valid(player, row + srow, col + scol, srow, scol)

    def play_move(self, player, move):
        other_player = 2 if player == 1 else 1
        row, col = move
        turn = np.sum(self.grid != 0)
        self.grid[row, col] = player
        if turn < 4:
            return
        for srow in range(-1, 2):
            for scol in range(-1, 2):
                if srow == 0 and scol == 0:
                    continue
                nrow = row + srow
                ncol = col + scol
                if not self.in_bounds(nrow, ncol):
                    continue
                if self.grid[nrow, ncol] == player:
                    continue
                if self.grid[nrow, ncol] == 0:
                    continue
                if self.grid[nrow, ncol] == other_player and self.is_run_valid(player, nrow, ncol, srow, scol):
                    self.set_run(player, nrow, ncol, srow, scol)

    def set_run(self, player, row, col, srow, scol):
        if not self.in_bounds(row, col) or self.grid[row, col] == 0 or self.grid[row, col] == player:
            return
        self.grid[row, col] = player
        self.set_run(player, row + srow, col + scol, srow, scol)
