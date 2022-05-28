from board_game_ai.games.game import Game
from board_game_ai.players.player import Player


class Minimax(Player):
    def __init__(self, player_id, minimax_depth, *args, **kwargs):
        super().__init__(player_id, *args, **kwargs)
        self.depth = minimax_depth

    def get_move(self, game: Game):
        moves = game.get_valid_moves(self.player_id)
        if not moves:
            return "nomoves"
        best_val = -float('inf')
        best_move = moves[0]
        for move in moves:
            child = game.copy()
            child.play_move(self.player_id, move)
            value = self.minimax(child, 0, 1 if self.player_id == 2 else 2, -float("inf"), float("inf"))
            if value > best_val:
                best_val = value
                best_move = move
        return best_move


    def minimax(self, game: Game, depth: int, player: int, alpha: float, beta: float):
        if game.is_termal_state() or depth >= self.depth:
            return game.state_value(self.player_id)
        if player == self.player_id:
            moves = game.get_valid_moves(player)
            best_val = -float("inf")
            for move in moves:
                child = game.copy()
                child.play_move(player, move)
                value = self.minimax(child, depth+1, 1 if player == 2 else 2, alpha, beta)
                best_val = max(best_val, value)
                if beta <= alpha:
                    break
            return best_val
        else:
            moves = game.get_valid_moves(player)
            best_val = float("inf")
            for move in moves:
                child = game.copy()
                child.play_move(player, move)
                value = self.minimax(child, depth+1, 1 if player == 2 else 2, alpha, beta)
                best_val = min(value, best_val)
                if beta <= alpha:
                    break
            return best_val
