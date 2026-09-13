import GamePlay from "./classes/GamePlay";
import GameController from "./classes/GameController.js";
import GameStateService from "./classes/GameStateService";

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
