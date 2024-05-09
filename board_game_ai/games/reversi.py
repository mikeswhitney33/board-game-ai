from copy import deepcopy

import pygame
from pygame import Surface

from ..colors import BLACK, GREEN, RED, WHITE
from .base_game import BaseGame

PLAYER_1 = 0
PLAYER_2 = 1


class Reversi(BaseGame):
    def __init__(self, board=None):
        if board is None:
            self.board = [[None for _ in range(8)] for _ in range(8)]
            self.board[3][3] = PLAYER_1
            self.board[3][4] = PLAYER_2
            self.board[4][3] = PLAYER_2
            self.board[4][4] = PLAYER_1
        else:
            self.board = deepcopy(board)
        super().__init__()

    def get_player_name(self, player: int) -> str | None:
        if player == PLAYER_1:
            return "Black"
        if player == PLAYER_2:
            return "White"
        return None

    def clone(self):
        return Reversi(board=self.board)

    def draw(self, screen: Surface):
        screen.fill(GREEN)
        width = screen.get_width()
        height = screen.get_height()

        cell_size = min(width // 8, height // 8)

        for i in range(8):
            for j in range(8):
                rect = pygame.Rect(j * cell_size, i * cell_size, cell_size, cell_size)
                pygame.draw.rect(screen, BLACK, rect, 1)

                if self.board[i][j] == PLAYER_1:
                    pygame.draw.circle(screen, BLACK, rect.center, cell_size // 2 - 2)
                elif self.board[i][j] == PLAYER_2:
                    pygame.draw.circle(screen, WHITE, rect.center, cell_size // 2 - 2)

        for row, col, player in self.get_possible_actions():
            if player == self.whose_turn():
                rect = pygame.Rect(
                    col * cell_size, row * cell_size, cell_size, cell_size
                )
                pygame.draw.rect(screen, RED, rect, 2)
        super().draw(screen)

    def check_winner(self):
        player1_count = sum(row.count(PLAYER_1) for row in self.board)
        player2_count = sum(row.count(PLAYER_2) for row in self.board)

        if player1_count > player2_count:
            return PLAYER_1
        elif player2_count > player1_count:
            return PLAYER_2
        else:
            return None

    def is_action_possible(self, action):
        if action is None:
            return False
        row, col = action[:2]
        return (
            0 <= row < 8
            and 0 <= col < 8
            and self.board[row][col] is None
            and self.get_valid_flips(action)
        )

    def update_state(self, action) -> bool:
        if self.is_action_possible(action):
            row, col, player = action
            self.board[row][col] = player
            self.flip_tiles(action)
            return True
        return False

    def whose_turn(self):
        player1_count = sum(row.count(PLAYER_1) for row in self.board)
        player2_count = sum(row.count(PLAYER_2) for row in self.board)
        return PLAYER_1 if (player1_count + player2_count) % 2 == 0 else PLAYER_2

    def is_done(self):
        return (
            not any(
                self.is_action_possible((i, j, self.whose_turn()))
                for i in range(8)
                for j in range(8)
            )
            # or self.check_winner() is not None
        )

    def get_possible_actions(self):
        actions = []
        player = self.whose_turn()
        for i in range(8):
            for j in range(8):
                if self.is_action_possible((i, j, player)):
                    actions.append((i, j, player))
        return actions

    def mouse2action(self, screen, mouse_x, mouse_y) -> any:
        width = screen.get_width()
        height = screen.get_height()
        cell_size = min(width // 8, height // 8)
        col = mouse_x // cell_size
        row = mouse_y // cell_size
        if 0 <= row < 8 and 0 <= col < 8:
            action = (row, col, self.whose_turn())
            if self.is_action_possible(action):
                return action
        return None

    def get_valid_flips(self, action):
        row, col, player = action
        opponent = PLAYER_2 if player == PLAYER_1 else PLAYER_1
        valid_flips = []

        for direction in [
            (0, 1),
            (1, 1),
            (1, 0),
            (1, -1),
            (0, -1),
            (-1, -1),
            (-1, 0),
            (-1, 1),
        ]:
            flips = []
            r, c = row + direction[0], col + direction[1]
            while 0 <= r < 8 and 0 <= c < 8 and self.board[r][c] == opponent:
                flips.append((r, c))
                r += direction[0]
                c += direction[1]

            if (
                len(flips) > 0
                and 0 <= r < 8
                and 0 <= c < 8
                and self.board[r][c] == player
            ):
                valid_flips.extend(flips)

        return valid_flips

    def flip_tiles(self, action):
        row, col, player = action
        valid_flips = self.get_valid_flips(action)
        for r, c in valid_flips:
            self.board[r][c] = player
