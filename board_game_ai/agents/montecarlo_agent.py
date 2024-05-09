import math
import random

from ..games.base_game import BaseGame
from .base_agent import BaseAgent


class MCAgent(BaseAgent):
    def __init__(
        self,
        *args,
        mc_num_simulations: int = 100,
        **kwargs,
    ):
        self.num_simulations = mc_num_simulations
        super().__init__(*args, **kwargs)

    def handle_auto_action(self, game: BaseGame) -> any:
        """
        Use Monte Carlo Tree Search to find the best move for the current game state.

        Args:
            game (BaseGame): The current game state.
            num_simulations (int): The number of simulations to run.
            exploration_factor (float): The exploration factor for balancing exploration and exploitation.

        Returns:
            Any: The best move found by the Monte Carlo Tree Search.
        """
        if game.whose_turn() != self.player:
            return
        best_action = None
        best_value = -math.inf
        for action in game.get_possible_actions():
            game_copy = game.clone()
            game_copy.update_state(action)
            value = self.simulate(game_copy)
            if value > best_value:
                best_value = value
                best_action = action
        game.update_state(best_action)

    def simulate(self, game: BaseGame):
        wins = 0
        losses = 0
        draws = 0
        for _ in range(self.num_simulations):
            game_copy = game.clone()
            while not game_copy.is_done():
                game_copy.update_state(random.choice(game_copy.get_possible_actions()))
            winner = game_copy.check_winner()
            if winner == self.player:
                wins += 1
            elif winner is None:
                draws += 1
            else:
                losses += 1
        return wins
