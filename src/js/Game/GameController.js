import THEMES from "../constants/themes.js";
import { generateTeam } from "../utils/generators.js";
import Bowman from "./characters/Bowman.js";
import Daemon from "./characters/Daemon.js";
import Magician from "./characters/Magician.js";
import Swordsman from "./characters/Swordsman.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(THEMES.prairie);

    const PLAYER_TYPES = [Bowman, Swordsman, Magician];
    const ENEMY_TYPES = [Vampire, Undead, Daemon];
    const playerTeam = generateTeam(PLAYER_TYPES, 3, 4);
    const enemyTeam = generateTeam(ENEMY_TYPES, 3, 4);
    const playerStartCells = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    const enemyStartCells = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    const playerPositionedCharacters = playerTeam.characters.map(
      (character) => {
        const randomPosition = Math.floor(
          Math.random() * playerStartCells.length,
        );
        const positionedCharacter = new PositionedCharacter(
          character,
          playerStartCells[randomPosition],
        );

        playerStartCells.splice(randomPosition, 1);

        return positionedCharacter;
      },
    );
    const enemyPositionedCharacters = enemyTeam.characters.map((character) => {
      const randomPosition = Math.floor(
        Math.random() * playerStartCells.length,
      );
      const positionedCharacter = new PositionedCharacter(
        character,
        enemyStartCells[randomPosition],
      );

      enemyStartCells.splice(randomPosition, 1);

      return positionedCharacter;
    });

    this.gamePlay.redrawPositions([
      ...playerPositionedCharacters,
      ...enemyPositionedCharacters,
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
