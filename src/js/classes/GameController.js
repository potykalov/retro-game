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
import cursors from "../constants/cursors.js";

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

    if (!selectedCharacter) {
      GamePlay.showError("Выберите своего персонажа");
      return;
    }

    if (this.savedIndex !== null) {
      this.gamePlay.deselectCell(this.savedIndex);
    }

    this.gamePlay.selectCell(index);
    this.savedIndex = index;
  }

  onCellEnter(index) {
    const currentCharacter = [
      ...this.enemyPositions,
      ...this.playerPositions,
    ].find(({ position }) => {
      return index === position;
    });
    const nextPlayerCharacter = this.playerPositions.find(({ position }) => {
      return index === position;
    });
    const enemyCharacter = this.enemyPositions.find(({ position }) => {
      return index === position;
    });
    const selectedCharacter = this.playerPositions.find(({ position }) => {
      return this.savedIndex === position;
    });
    const attackRanges = {
      swordsman: 1,
      bowman: 2,
      magician: 4,
    };
    const moveRanges = {
      swordsman: 4,
      bowman: 2,
      magician: 1,
    };
    const rowDistance = Math.abs(
      Math.floor(index / 8) - Math.floor(this.savedIndex / 8),
    );
    const columnDistance = Math.abs((index % 8) - (this.savedIndex % 8));

    if (selectedCharacter && enemyCharacter) {
      const attackRange = attackRanges[selectedCharacter.character.type];

      if (rowDistance <= attackRange && columnDistance <= attackRange) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, "red");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }

    if (currentCharacter) {
      this.gamePlay.showCellTooltip(
        this.generateMessage(currentCharacter, index),
        index,
      );
    }

    if (this.savedIndex !== null && nextPlayerCharacter) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    if (selectedCharacter && !currentCharacter) {
      const moveRange = moveRanges[selectedCharacter.character.type];

      const isStraight = rowDistance === 0 || columnDistance === 0;
      const isDiagonal = rowDistance === columnDistance;

      if (
        rowDistance <= moveRange &&
        columnDistance <= moveRange &&
        (isStraight || isDiagonal)
      ) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, "green");
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
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

    if (index !== this.savedIndex) {
      this.gamePlay.deselectCell(index);
    }

    this.gamePlay.setCursor(cursors.auto);
  }

  generateMessage({ character: { level, attack, defence, health } }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }
}
