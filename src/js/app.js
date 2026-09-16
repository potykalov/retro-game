import GamePlay from "./game/GamePlay.js";
import GameController from "./game/GameController";
import GameStateService from "./game/GameStateService";
// import Bowman from "./Game/characters/Bowman.js";
// import Character from "./Game/Character.js";
// import { characterGenerator, generateTeam } from "./utils/generators.js";
// import Swordsman from "./Game/characters/Swordsman.js";
// import Magician from "./Game/characters/Magician.js";
// import Team from "./Game/Team.js";

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector("#game-container"));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();
