from pygame import Surface

from board_game_ai.games.base_game import BaseGame

from .base_agent import BaseAgent


class HumanAgent(BaseAgent):
    def handle_input(
        self, screen: Surface, mouse_x: float, mouse_y: float, game: BaseGame
    ):
        if game.whose_turn() == self.player:
            action = game.mouse2action(screen, mouse_x, mouse_y)
            game.update_state(action)
