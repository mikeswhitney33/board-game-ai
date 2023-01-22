import { GameManager } from "./js/game-manager.js";

function main() {
    const canvas = document.querySelector("canvas");
    const gameSelect = document.querySelector("select#game");
    const player1Select = document.querySelector("select#player1");
    const player2Select = document.querySelector("select#player2");
    const resetBtn = document.querySelector("div#reset-btn");

    const manager = new GameManager(canvas);
    function reset() {
        manager.reset();
        manager.play();
    }
    resetBtn.addEventListener("click", reset);
    gameSelect.addEventListener("change", reset);
    player1Select.addEventListener("change", reset);
    player2Select.addEventListener("change", reset);
    manager.play();
}

window.onload = main;
