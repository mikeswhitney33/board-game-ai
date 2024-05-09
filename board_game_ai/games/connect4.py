from abc import abstractmethod
from copy import deepcopy

import pygame
from pygame import Surface

from ..colors import BLACK, BLUE, RED, YELLOW
from .base_game import BaseGame

RED_PLAYER = 0
YELLOW_PLAYER = 1


class Connect4(BaseGame):
    def __init__(self, board=None):
        self.rows = 6
        self.cols = 7
        if board is None:
            self.board = [[None for _ in range(self.cols)] for _ in range(self.rows)]
        else:
            self.board = deepcopy(board)
        super().__init__(end_text_color=BLACK)

    def get_player_name(self, player: int) -> str | None:
        if player == RED_PLAYER:
            return "Red"
        if player == YELLOW_PLAYER:
            return "Yellow"
        return None

    def clone(self):
        return Connect4(board=self.board)

    def draw(self, screen: Surface):
        # Draw the Connect 4 board
        width = screen.get_width()
        height = screen.get_height()
        total_rows = self.rows + 1
        cell_width = width // self.cols
        cell_height = height // total_rows
        screen.fill(BLUE)
        for row in range(1, self.rows + 1):
            for col in range(self.cols):
                val = self.board[row - 1][col]
                cx = (col + 0.5) * cell_width
                cy = (row + 0.5) * cell_height
                r = cell_width // 2 - 10
                if val == RED_PLAYER:
                    pygame.draw.circle(screen, RED, (cx, cy), r)
                elif val == YELLOW_PLAYER:
                    pygame.draw.circle(screen, YELLOW, (cx, cy), r)
                else:
                    pygame.draw.circle(screen, (127, 127, 127), (cx, cy), r)
        super().draw(screen)

    def check_winner(self) -> int | None:
        """
        Checks if a player has won the game on the given board.
        Returns 0 if the red player wins, 1 if the yellow player wins, or None if no player has won.
        """
        board = self.board
        # Check horizontal lines
        for row in board:
            for i in range(len(row) - 3):
                if row[i] is not None and all(
                    row[i] == row[j] for j in range(i, i + 4)
                ):
                    return row[i]

        # Check vertical lines
        for col in range(len(board[0])):
            for row in range(len(board) - 3):
                if board[row][col] is not None and all(
                    board[row][col] == board[row + j][col] for j in range(1, 4)
                ):
                    return board[row][col]

        # Check diagonal lines (top-left to bottom-right)
        for row in range(len(board) - 3):
            for col in range(len(board[0]) - 3):
                if board[row][col] is not None and all(
                    board[row][col] == board[row + j][col + j] for j in range(1, 4)
                ):
                    return board[row][col]

        # Check diagonal lines (top-right to bottom-left)
        for row in range(len(board) - 3):
            for col in range(3, len(board[0])):
                if board[row][col] is not None and all(
                    board[row][col] == board[row + j][col - j] for j in range(1, 4)
                ):
                    return board[row][col]

        return None

    def is_action_possible(self, action):
        col, _ = action
        for row in range(self.rows - 1, -1, -1):
            if self.board[row][col] is None:
                return True
        return False

    def update_state(self, action):
        col, player = action
        for row in range(self.rows - 1, -1, -1):
            if self.board[row][col] is None:
                self.board[row][col] = player
                return True
        return False

    def is_done(self):
        return self.check_winner() is not None or all(
            self.board[row][col] is not None
            for row in range(self.rows)
            for col in range(self.cols)
        )

    def get_possible_actions(self):
        player = self.whose_turn()
        return [
            (col, player)
            for col in range(self.cols)
            if self.is_action_possible((col, player))
        ]

    def whose_turn(self):
        count_RED = sum(row.count(RED_PLAYER) for row in self.board)
        count_YELLOW = sum(row.count(YELLOW_PLAYER) for row in self.board)
        return RED_PLAYER if count_RED == count_YELLOW else YELLOW_PLAYER

    def mouse2action(self, screen, mouse_x, mouse_y) -> any:
        width = screen.get_width()
        col = mouse_x // (width // self.cols)
        if 0 <= col < self.cols:
            return (col, self.whose_turn())
        return None
