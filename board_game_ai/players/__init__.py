from board_game_ai.players.human import Human
from board_game_ai.players.random import RandomAI
from board_game_ai.players.minimax import Minimax

PLAYER_DICT = {
    "human": Human,
    "random": RandomAI,
    "minimax": Minimax,
}

PLAYER_KEYS = list(PLAYER_DICT.keys())

def get_player(name, *args, **kwargs):
    if name not in PLAYER_DICT:
        raise ValueError(f"\"{name}\" is not a valid player type.  Available player types include: {PLAYER_KEYS}")
    return PLAYER_DICT[name](*args, **kwargs)
