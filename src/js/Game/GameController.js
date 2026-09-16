import THEMES from "../constants/themes.js";
import { generateTeam } from "../utils/generators.js";
import Bowman from "./characters/Bowman.js";
import Daemon from "./characters/Daemon.js";
import Magician from "./characters/Magician.js";
import Swordsman from "./characters/Swordsman.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import GamePlay from "./GamePlay.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameController {
  playerActiveCharacterIndex = undefined;
  PLAYER_TYPES = [Bowman, Swordsman, Magician];
  ENEMY_TYPES = [Vampire, Undead, Daemon];

  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(THEMES.prairie);

    const playerTeam = generateTeam(this.PLAYER_TYPES, 3, 4);
    const enemyTeam = generateTeam(this.ENEMY_TYPES, 3, 4);
    const playerStartCells = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    const enemyStartCells = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    this.playerPositionedCharacters = playerTeam.characters.map((character) => {
      const randomPosition = Math.floor(
        Math.random() * playerStartCells.length,
      );
      const positionedCharacter = new PositionedCharacter(
        character,
        playerStartCells[randomPosition],
      );

      playerStartCells.splice(randomPosition, 1);

      return positionedCharacter;
    });
    this.enemyPositionedCharacters = enemyTeam.characters.map((character) => {
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
      ...this.playerPositionedCharacters,
      ...this.enemyPositionedCharacters,
    ]);

    this.gamePlay.addCellClickListener((index) => {
      this.onCellClick(index);
    });

    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
    });

    this.gamePlay.addCellLeaveListener((index) => {
      this.onCellLeave(index);
    });

    this.state = this.stateService.load();
  }

  onCellClick(index) {
    const playerCharacterClicked = this.playerPositionedCharacters.find(
      (playerCharacter) => {
        return playerCharacter.position === index;
      },
    );

    if (!playerCharacterClicked && !this.playerActiveCharacterIndex) {
      GamePlay.showError("Выберите своего персонажа");
    }

    if (this.playerActiveCharacterIndex && playerCharacterClicked) {
      this.gamePlay.deselectCell(this.playerActiveCharacterIndex);
    }

    if (playerCharacterClicked) {
      this.gamePlay.selectCell(index);
      this.playerActiveCharacterIndex = playerCharacterClicked.position;
    }
  }

  onCellEnter(index) {
    this.characterHovered = [
      ...this.playerPositionedCharacters,
      ...this.enemyPositionedCharacters,
    ].find(({ position }) => position === index);

    if (this.characterHovered) {
      this.gamePlay.showCellTooltip(
        this.generateMessage(this.characterHovered),
        index,
      );
    }
  }

  onCellLeave(index) {
    if (this.characterHovered) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  generateMessage({ character: { level, attack, defence, health } }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }
}
