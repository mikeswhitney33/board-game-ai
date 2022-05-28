


class Player:
    def __init__(self, player_id, *args, **kwargs):
        self.player_id = player_id

    def get_move(self, game):
        raise NotImplementedError