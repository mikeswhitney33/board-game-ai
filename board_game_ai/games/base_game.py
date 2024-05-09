from abc import abstractmethod

import pygame
from pygame import Surface

from ..colors import RED


class BaseGame:
    def __init__(self, end_text_color: tuple[int, int, int] = RED):
        """
        Initialize a BaseGame instance.

        Args:
            end_text_color (tuple[int, int, int]): The RGB color for the end game text (default is RED).
        """
        self.text_surface = None
        self.end_text_color = end_text_color
        self.font = pygame.font.SysFont("Comic Sans MS", 50)

    @abstractmethod
    def get_player_name(player: int) -> str | None:
        """
        Get the name of the player for the given player index.

        Args:
            player (int): The index of the player.

        Returns:
            str | None: The name of the player, or None if the player index is invalid.
        """
        ...

    @abstractmethod
    def clone(self) -> "BaseGame":
        """
        Create a deep copy of the current game state.

        Returns:
            BaseGame: A new instance of the game with the same state as the current game.
        """
        ...

    def get_endgame_message(self, winner):
        """
        Get the end game message based on the winner.

        Args:
            winner (int | None): The index of the winning player, or None if the game is a tie.

        Returns:
            str: The end game message.
        """
        if winner is not None:
            return f"{self.get_player_name(winner)} Wins!"
        return "Tie Game!"

    @abstractmethod
    def draw(self, screen: Surface) -> None:
        """
        Draw the current game state on the provided screen.

        Args:
            screen (Surface): The Pygame Surface to draw the game state on.
        """
        if self.text_surface is None:
            if self.is_done():
                message = self.get_endgame_message(self.check_winner())
                self.text_surface = self.font.render(
                    message, False, self.end_text_color
                )

        if self.text_surface is not None:
            cx = screen.get_width() // 2 - self.text_surface.get_width() // 2
            cy = screen.get_height() // 2 - self.text_surface.get_height() // 2
            screen.blit(self.text_surface, (cx, cy))

    @abstractmethod
    def check_winner(self) -> str | None:
        """
        Check the current game state and determine the winner.

        Returns:
            str | None: The index of the winning player, or None if the game is not yet won or is a tie.
        """
        ...

    @abstractmethod
    def is_action_possible(self, action) -> bool:
        """
        Check if a given action is possible in the current game state.

        Args:
            action: The action to check.

        Returns:
            bool: True if the action is possible, False otherwise.
        """
        ...

    @abstractmethod
    def update_state(self, action) -> bool:
        """
        Update the game state based on the given action.

        Args:
            action: The action to apply to the game state.

        Returns:
            bool: True if the action was successfully applied, False otherwise.
        """
        ...

    @abstractmethod
    def is_done(self) -> bool:
        """
        Check if the game is over.

        Returns:
            bool: True if the game is over, False otherwise.
        """
        ...

    @abstractmethod
    def get_possible_actions(self) -> list:
        """
        Get a list of all possible actions in the current game state.

        Returns:
            list: A list of all possible actions.
        """
        ...

    @abstractmethod
    def whose_turn(self) -> int:
        """
        Get the index of the player whose turn it is.

        Returns:
            int: The index of the player whose turn it is.
        """
        ...

    @abstractmethod
    def mouse2action(self, screen, mouse_x, mouse_y) -> any:
        """
        Convert mouse coordinates to a game action.

        Args:
            screen (Surface): The Pygame Surface that the game is being drawn on.
            mouse_x (int): The x-coordinate of the mouse cursor.
            mouse_y (int): The y-coordinate of the mouse cursor.

        Returns:
            Any: The game action corresponding to the mouse coordinates.
        """
        ...
