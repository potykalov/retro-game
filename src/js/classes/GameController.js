import themes from "../constants/themes";
import GamePlay from "./GamePlay.js";
import Bowman from "./characters/Bowman.js";
import Swordsman from "./characters/Swordsman.js";
import Magician from "./characters/Magician.js";
import { generateTeam } from "../utils/generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import Daemon from "./characters/Daemon.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";

// Класс, отвечающий за логику приложения

export default class GameController {
  savedIndex = null;

  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const playerTypes = [Bowman, Swordsman, Magician];
    const playerTeam = generateTeam(playerTypes, 3, 4);
    const playerStartPositions = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    this.playerPositions = playerTeam.characters.map((character) => {
      const index = Math.floor(Math.random() * playerStartPositions.length);
      const positionedCharacter = new PositionedCharacter(
        character,
        playerStartPositions[index],
      );
      playerStartPositions.splice(index, 1);

      return positionedCharacter;
    });

    const enemyTypes = [Vampire, Undead, Daemon];
    const enemyTeam = generateTeam(enemyTypes, 3, 4);
    const enemyStartPositions = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    this.enemyPositions = enemyTeam.characters.map((character) => {
      const index = Math.floor(Math.random() * enemyStartPositions.length);
      const positionedCharacter = new PositionedCharacter(
        character,
        enemyStartPositions[index],
      );
      enemyStartPositions.splice(index, 1);

      return positionedCharacter;
    });

    this.gamePlay.redrawPositions([
      ...this.playerPositions,
      ...this.enemyPositions,
    ]);

    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
    });

    this.gamePlay.addCellLeaveListener((index) => {
      this.onCellLeave(index);
    });

    this.gamePlay.addCellClickListener((index) => {
      this.onCellClick(index);
    });

    try {
      this.state = this.stateService.load();
    } catch (error) {
      GamePlay.showError(error.message);
    }
  }

  onCellClick(index) {
    const selectedCharacter = this.playerPositions.find(({ position }) => {
      return index === position;
    });

    if (selectedCharacter && this.savedIndex) {
      this.gamePlay.deselectCell(this.savedIndex);
      this.gamePlay.selectCell(index);
    }

    if (selectedCharacter) {
      this.gamePlay.selectCell(index);
      this.savedIndex = index;
    } else {
      GamePlay.showError("Выберите своего персонажа");
    }
  }

  onCellEnter(index) {
    const currentCharacter = [
      ...this.enemyPositions,
      ...this.playerPositions,
    ].find(({ position }) => {
      return index === position;
    });

    if (currentCharacter) {
      this.gamePlay.showCellTooltip(
        this.generateMessage(currentCharacter, index),
        index,
      );
    }
  }

  onCellLeave(index) {
    const players = [...this.enemyPositions, ...this.playerPositions].find(
      ({ position }) => {
        return index === position;
      },
    );

    if (players) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  generateMessage({ character: { level, attack, defence, health } }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }
}
