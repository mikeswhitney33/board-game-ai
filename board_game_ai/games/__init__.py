from board_game_ai.games.connect4 import Connect4Game
from board_game_ai.games.tictactoe import TicTacToeGame
from board_game_ai.games.othello import OthelloGame


GAME_DICT = {
    "tictactoe": TicTacToeGame,
    "othello": OthelloGame,
    "connect4": Connect4Game
}
GAME_KEYS = list(GAME_DICT.keys())

def get_game(name, *args, **kwargs):
    if name not in GAME_DICT:
        raise ValueError(f"\"{name}\" is not a valid player type.  Available player types include: {GAME_KEYS}")
    return GAME_DICT[name](*args, **kwargs)