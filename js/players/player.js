export class Player {
    constructor(player, manager) {
        this.player = player;
        this.manager = manager;
    }
    playTurn() {

    }
    finishTurn() {
        const self = this;
        setTimeout(() => {
            self.manager.finishTurn(self.player);
        }, 200);
    }
    reset() { }
}