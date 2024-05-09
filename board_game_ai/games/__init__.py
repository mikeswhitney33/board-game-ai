from .base_game import BaseGame
from .connect4 import Connect4
from .reversi import Reversi
from .tictactoe import TicTacToe

GAME_MAP = {
    "tictactoe": TicTacToe,
    "connect4": Connect4,
    "reversi": Reversi,
    "othello": Reversi,
}

GAME_LIST = list(GAME_MAP.keys())
