import argparse
import contextlib

import pygame

from board_game_ai.agents import AGENT_LIST, AGENT_MAP
from board_game_ai.games import GAME_LIST, GAME_MAP

WINDOW_SIZE = (600, 600)


def parse_arguments():
    """Parse command-line arguments and return an argparse.Namespace object."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--game", choices=GAME_LIST, default=GAME_LIST[0])
    parser.add_argument("--player1", "-p1", choices=AGENT_LIST, default=AGENT_LIST[0])
    parser.add_argument("--player2", "-p2", choices=AGENT_LIST, default=AGENT_LIST[0])
    parser.add_argument("--minimax_depth", type=int, default=4)
    parser.add_argument("--mc_num_simulations", type=int, default=100)
    return parser.parse_args()


def setup_game(args):
    """Set up the game based on the provided arguments."""
    game = GAME_MAP[args.game]()
    agents = [
        AGENT_MAP[args.player1](
            0,
            minimax_depth=args.minimax_depth,
            mc_num_simulations=args.mc_num_simulations,
        ),
        AGENT_MAP[args.player2](
            1,
            minimax_depth=args.minimax_depth,
            mc_num_simulations=args.mc_num_simulations,
        ),
    ]
    return game, agents


def check_winner(game):
    """Check and print the winner of the game."""
    winner = game.check_winner()
    print(f"Winner: {game.get_player_name(winner)}")


def run_game(game, agents):
    """Run the game loop and handle user input and agent actions."""
    screen = pygame.display.set_mode(WINDOW_SIZE)
    pygame.display.set_caption(game.__class__.__name__)

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_x, mouse_y = event.pos
                if not game.is_done():
                    current_agent = agents[game.whose_turn()]
                    current_agent.handle_input(screen, mouse_x, mouse_y, game)

        if not game.is_done():
            current_agent = agents[game.whose_turn()]
            current_agent.handle_auto_action(game)

        game.draw(screen)
        pygame.display.flip()

    check_winner(game)


def main():
    """Entry point of the program."""
    with contextlib.ExitStack() as stack:
        pygame.init()
        pygame.font.init()
        stack.callback(pygame.quit)
        args = parse_arguments()
        game, agents = setup_game(args)
        run_game(game, agents)


if __name__ == "__main__":
    main()
