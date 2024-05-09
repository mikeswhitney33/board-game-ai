import random

from ..games.base_game import BaseGame
from .base_agent import BaseAgent


class RandomAgent(BaseAgent):
    def handle_auto_action(self, game: BaseGame):
        if self.player == game.whose_turn():
            possible_actions = game.get_possible_actions()
            if possible_actions:
                action = random.choice(possible_actions)
                game.update_state(action)
