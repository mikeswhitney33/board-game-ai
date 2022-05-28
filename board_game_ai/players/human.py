from board_game_ai.players.player import Player
from board_game_ai.games.game import Game
import pygame


class Human(Player):
    def get_move(self, game: Game):
        for event in pygame.event.get(pygame.MOUSEBUTTONUP):
            posx, posy = pygame.mouse.get_pos()
            move = game.mouse_pos_to_cell_num(posx, posy, 500, 500)
            return move
