import GamePlay from "./classes/GamePlay";
import GameController from "./classes/GameController.js";
import GameStateService from "./classes/GameStateService";
import Bowman from "./classes/characters/Bowman.js";
import Swordsman from "./classes/characters/Swordsman.js";
import Character from "./classes/Character.js";
import Daemon from "./classes/characters/Daemon.js";
import Magician from "./classes/characters/Magician.js";
import { characterGenerator, generateTeam } from "./utils/generators.js";
import Team from "./classes/Team.js";

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
