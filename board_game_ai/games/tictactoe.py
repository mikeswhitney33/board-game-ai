from board_game_ai.games.game import Game
import numpy as np
import pygame


class TicTacToeGame(Game):
    def __init__(self, *, grid=None):
        super().__init__(grid=grid, rows=3, cols=3)
        self.font = pygame.font.SysFont("serif", 50)

    def state_value(self, player):
        if self.is_win(player):
            return 10
        elif self.is_win(1 if player == 2 else 2):
            return -10
        else:
            return 0

    def is_win(self, player):
        mask = self.grid == player
        return mask.all(0).any() | mask.all(1).any() | np.diag(mask).all() | np.diag(mask[:,::-1]).all()

    def is_termal_state(self):
        return not np.any(self.grid==0) or self.is_win(1) or self.is_win(2)

    def play_move(self, player, move):
        row, col = move
        self.grid[row, col] = player

    def is_valid_move(self, player, move):
        row, col = move
        return self.grid[row, col] == 0

    def which_three(self, player):
        mask = self.grid == player
        if mask.all(0).any():
            col = np.argmax(mask.all(0))
            return ((0, col), (2, col))
        if mask.all(1).any():
            row = np.argmax(mask.all(1))
            return ((row, 0), (row, 2))
        if np.diag(mask).all():
            return ((0, 0), (2, 2))
        if np.diag(mask[:,::-1]).all():
            return ((0, 2), (2, 0))
        return None

    def draw(self, screen: pygame.Surface, player: int):
        width, height = screen.get_size()
        screen.fill((255, 255, 255))
        cell_width = width // 3
        cell_height = height // 3
        pygame.draw.line(screen, (0, 0, 0), (cell_width, 0), (cell_width, height))
        pygame.draw.line(screen, (0, 0, 0), (2 * cell_width, 0), (2 * cell_width, height))
        pygame.draw.line(screen, (0, 0, 0), (0, cell_height), (width, cell_height))
        pygame.draw.line(screen, (0, 0, 0), (0, 2 * cell_height), (width, 2 * cell_height))
        for row in range(3):
            for col in range(3):
                if self.grid[row, col] == 1:
                    pygame.draw.line(screen, (0, 0, 0), (col * cell_width + 10, row * cell_height + 10), ((col + 1) * cell_width -10, (row + 1) * cell_height - 10), 10)
                    pygame.draw.line(screen, (0, 0, 0), (col * cell_width + 10, (row + 1) * cell_height - 10), ((col + 1) * cell_width - 10, row * cell_height + 10), 10)
                elif self.grid[row, col] == 2:
                    pygame.draw.ellipse(screen, (0, 0, 0), (col * cell_width + 10, row * cell_height + 10, cell_width - 20, cell_height - 20), 10)
        if self.is_termal_state():
            cats = False
            if self.is_win(1):
                ((row1, col1), (row2, col2)) = self.which_three(1)
                text = "X wins!"
            elif self.is_win(2):
                ((row1, col1), (row2, col2)) = self.which_three(2)
                text = "O Wins"
            else:
                text = "Cat's Game!"
                cats = True
            text = self.font.render(text, False, (255, 0, 0))
            text_width, text_height = text.get_size()
            screen.blit(text, (width // 2 - text_width // 2, height // 2 - text_height // 2))
            if not cats:
                pygame.draw.line(screen, (255, 0, 0), (col1 * cell_width + cell_width//2, row1 * cell_height + cell_height // 2), (col2 * cell_width + cell_width //2, row2 * cell_height + cell_height // 2), 5)




