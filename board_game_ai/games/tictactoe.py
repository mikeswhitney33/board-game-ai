from copy import deepcopy

import pygame
from pygame import Surface

from ..colors import BLACK, WHITE
from .base_game import BaseGame

X = 0
O = 1


class TicTacToe(BaseGame):
    def __init__(self, board=None):
        if board is None:
            self.board = [[None for _ in range(3)] for _ in range(3)]
        else:
            self.board = deepcopy(board)
        super().__init__()

    def get_player_name(self, player: int) -> str | None:
        if player == X:
            return "X"
        if player == O:
            return "O"
        return None

    def clone(self):
        return TicTacToe(board=self.board)

    def get_endgame_message(self, winner):
        if winner is not None:
            return f"{self.get_player_name(winner)} Wins!"
        return "Cat's Game!"

    def draw(self, screen: Surface):
        screen.fill(WHITE)
        width = screen.get_width()
        height = screen.get_height()

        third_width = width // 3
        third_height = height // 3

        pygame.draw.line(screen, BLACK, (third_width, 0), (third_width, height), 2)
        pygame.draw.line(
            screen, BLACK, (third_width * 2, 0), (third_width * 2, height), 2
        )
        pygame.draw.line(screen, BLACK, (0, third_height), (width, third_height), 2)
        pygame.draw.line(
            screen, BLACK, (0, third_height * 2), (width, third_height * 2), 2
        )

        for i, row in enumerate(self.board):
            for j, val in enumerate(row):
                if val == X:
                    x1 = j * third_width + 10
                    x2 = (j + 1) * third_width - 10
                    y1 = i * third_height + 10
                    y2 = (i + 1) * third_height - 10
                    pygame.draw.line(screen, BLACK, (x1, y1), (x2, y2), 4)
                    pygame.draw.line(screen, BLACK, (x1, y2), (x2, y1), 4)
                elif val == O:
                    cx = (j + 0.5) * third_width
                    cy = (i + 0.5) * third_width
                    pygame.draw.circle(
                        screen, BLACK, (cx, cy), third_width // 2 - 10, 4
                    )
        super().draw(screen)

    def check_winner(self):
        for row in self.board:
            if row.count(row[0]) == len(row) and row[0] is not None:
                return row[0]
        for col in range(3):
            if self.board[0][col] == self.board[1][col] == self.board[2][col] != None:
                return self.board[0][col]
        if self.board[0][0] == self.board[1][1] == self.board[2][2] != None:
            return self.board[0][0]
        if self.board[0][2] == self.board[1][1] == self.board[2][0] != None:
            return self.board[0][2]
        return None

    def is_action_possible(self, action):
        row, col, _ = action
        return self.board[row][col] is None

    def update_state(self, action) -> bool:
        if self.is_action_possible(action):
            row, col, value = action
            self.board[row][col] = value
            return True
        return False

    def whose_turn(self):
        count_X = sum(row.count(X) for row in self.board)
        count_O = sum(row.count(O) for row in self.board)
        return X if count_X == count_O else O

    def is_done(self):
        return (
            all(cell is not None for row in self.board for cell in row)
            or self.check_winner() is not None
        )

    def get_possible_actions(self):
        actions = []
        player = self.whose_turn()
        for i in range(3):
            for j in range(3):
                if self.board[i][j] is None:
                    actions.append((i, j, player))
        return actions

    def mouse2action(self, screen, mouse_x, mouse_y) -> any:
        width = screen.get_width()
        height = screen.get_height()
        col = mouse_x // (width // 3)
        row = mouse_y // (height // 3)
        if 0 <= row < 3 and 0 <= col < 3 and self.board[row][col] is None:
            return (row, col, self.whose_turn())
        return None
