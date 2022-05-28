from board_game_ai.players.player import Player
from board_game_ai.games.game import Game
import random
import time


class RandomAI(Player):
    def get_move(self, game: Game):
        time.sleep(0.2)
        moves = game.get_valid_moves(self.player_id)
        if not moves:
            return "nomoves"
        return random.choice(moves)
