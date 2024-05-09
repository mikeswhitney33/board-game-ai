import math
import random

from ..games.base_game import BaseGame
from .base_agent import BaseAgent


class MinimaxAgent(BaseAgent):
    def __init__(self, *args, minimax_depth=4, **kwargs):
        self.minimax_depth = minimax_depth
        super().__init__(*args, **kwargs)

    def handle_auto_action(self, game: BaseGame):
        if not game.whose_turn() == self.player:
            return

        def max_value(game, alpha, beta, depth=0):
            if game.is_done() or depth >= self.minimax_depth:
                winner = game.check_winner()
                if winner is None:
                    return 0
                if winner == self.player:
                    return 10
                return -10
            value = -math.inf
            for action in game.get_possible_actions():
                game_copy = game.clone()
                game_copy.update_state(action)
                value = max(value, min_value(game_copy, alpha, beta, depth + 1))
                if value >= beta:
                    return value
                alpha = max(alpha, value)
            return value

        def min_value(game, alpha, beta, depth=0):
            if game.is_done() or depth >= self.minimax_depth:
                winner = game.check_winner()
                if winner is None:
                    return 0
                if winner == self.player:
                    return 10
                return -10
            value = math.inf
            for action in game.get_possible_actions():
                game_copy = game.clone()
                game_copy.update_state(action)
                value = min(value, max_value(game_copy, alpha, beta, depth + 1))
                if value <= alpha:
                    return value
                beta = min(beta, value)
            return value

        best_value = -math.inf
        best_action = None
        for action in game.get_possible_actions():
            game_copy = game.clone()
            game_copy.update_state(action)
            value = min_value(game_copy, -math.inf, math.inf)
            if value > best_value:
                best_value = value
                best_action = action
        if best_action is None:
            best_action = random.choice(game.get_possible_actions())
        game.update_state(best_action)
