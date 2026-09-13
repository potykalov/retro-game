import themes from "../constants/themes";
import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import { generateTeam } from "../utils/generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import Daemon from "./characters/Magician.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";

// Класс, отвечающий за логику приложения

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    const playerPositions = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    const playerStartPositions = playerTeam.characters.map((character) => {
      const index = Math.floor(Math.random() * playerPositions.length);
      const positionedCharacter = new PositionedCharacter(
        character,
        playerPositions[index],
      );
      playerPositions.splice(index, 1);

      return positionedCharacter;
    });

    const enemyTypes = [Vampire, Undead, Daemon];
    const enemyTeam = generateTeam(enemyTypes, 3, 4);
    const enemyPositions = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    const enemyStartPositions = enemyTeam.characters.map((character) => {
      const index = Math.floor(Math.random() * enemyPositions.length);
      const positionedCharacter = new PositionedCharacter(
        character,
        enemyPositions[index],
      );
      enemyPositions.splice(index, 1);

      return positionedCharacter;
    });

    this.gamePlay.redrawPositions([
      ...playerStartPositions,
      ...enemyStartPositions,
    ]);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  // onCellClick(index) {
  //   // TODO: react to click
  // }

  // onCellEnter(index) {
  //   // TODO: react to mouse enter
  // }

  // onCellLeave(index) {
  //   // TODO: react to mouse leave
  // }
}
