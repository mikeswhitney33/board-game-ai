from pygame import Surface

from ..games.base_game import BaseGame


class BaseAgent:
    def __init__(self, player: int, *args, **kwargs):
        self._player = player

    @property
    def player(self):
        return self._player

    @property
    def opponent(self):
        return 1 if self._player == 0 else 0

    def handle_input(
        self, screen: Surface, mouse_x: float, mouse_y: float, game: BaseGame
    ): ...

    def handle_auto_action(self, game: BaseGame): ...
