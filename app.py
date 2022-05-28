from argparse import ArgumentParser
import pygame
from board_game_ai.games import get_game, GAME_KEYS
from board_game_ai.players import get_player, PLAYER_KEYS


def main():
    parser = ArgumentParser()
    parser.add_argument("--game", default="tictactoe", choices=GAME_KEYS)
    parser.add_argument("--player1", default="human", choices=PLAYER_KEYS)
    parser.add_argument("--player2", default="human", choices=PLAYER_KEYS)
    parser.add_argument("--minimax_depth1", default=3, type=int)
    parser.add_argument("--minimax_depth2", default=3, type=int)
    args = parser.parse_args()

    pygame.init()
    screen = pygame.display.set_mode((500, 500))
    game = get_game(args.game)
    cur_player = 1
    toggle = {1:2,2:1}

    players = {
        1: get_player(args.player1, 1, minimax_depth=args.minimax_depth1),
        2: get_player(args.player2, 2, minimax_depth=args.minimax_depth2)
    }

    game.draw(screen, cur_player)
    pygame.display.update()
    running = True
    while running:
        for event in pygame.event.get(pygame.KEYDOWN):
            if event.key in (ord("q"), 27):
                running = False
                break
            elif event.key == ord("r"):
                cur_player = 1
                game.reset()
                game.draw(screen, cur_player)
        if args.player1 == "human" or args.player2 == "human":
            for event in pygame.event.get(pygame.MOUSEMOTION):
                game.draw(screen, cur_player)

        for event in pygame.event.get(pygame.QUIT):
            running = False
            break
        if not running:
            break
        if game.is_termal_state():
            continue
        move = players[cur_player].get_move(game.copy())
        if move == "nomoves":
            cur_player = toggle[cur_player]
        elif move is not None and game.is_valid_move(cur_player, move):
            game.play_move(cur_player, move)
            cur_player = toggle[cur_player]
            game.draw(screen, cur_player)
        pygame.display.update()
    pygame.quit()

if __name__ == "__main__":
    main()
