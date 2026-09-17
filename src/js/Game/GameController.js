import { PLAYER_TYPES, ENEMY_TYPES } from "../constants/characterTypes.js";
import CURSORS from "../constants/cursors.js";
import { ATTACK_RANGES, MOVE_RANGES } from "../constants/ranges.js";
import THEMES from "../constants/themes.js";
import { generateTeam } from "../utils/generators.js";
import GamePlay from "./GamePlay.js";
import GameState from "./GameState.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameController {
  playerActiveCharacterIndex = null;
  gameState = new GameState();

  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(THEMES.prairie);
    const playerTeam = generateTeam(PLAYER_TYPES, 3, 4);
    const enemyTeam = generateTeam(ENEMY_TYPES, 3, 4);
    const playerStartCells = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];
    const enemyStartCells = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];
    // const enemyStartCells = [2, 10, 18, 26, 34, 42, 50, 58];

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
      const randomPosition = Math.floor(Math.random() * enemyStartCells.length);
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
    if (this.gameState.isPlayerTurn === false) {
      return;
    }

    const playerCharacterClicked = this.playerPositionedCharacters.find(
      (playerCharacter) => {
        return playerCharacter.position === index;
      },
    );
    const enemyCharacterClicked = this.enemyPositionedCharacters.find(
      ({ position }) => position === index,
    );

    if (!playerCharacterClicked && this.playerActiveCharacterIndex === null) {
      GamePlay.showError("Выберите своего персонажа");
    }

    if (this.playerActiveCharacterIndex !== null && playerCharacterClicked) {
      this.gamePlay.deselectCell(this.playerActiveCharacterIndex);
    }

    if (playerCharacterClicked) {
      this.gamePlay.selectCell(index);
      this.playerActiveCharacterIndex = playerCharacterClicked.position;
      return;
    }

    if (this.playerActiveCharacterIndex !== null) {
      const columnDistance = Math.abs(
        (index % 8) - (this.playerActiveCharacterIndex % 8),
      );
      const rowDistance = Math.abs(
        Math.floor(index / 8) - Math.floor(this.playerActiveCharacterIndex / 8),
      );
      const isStraight = columnDistance === 0 || rowDistance === 0;
      const isDiagonal = rowDistance === columnDistance;
      const selectedCharacter = this.playerPositionedCharacters.find(
        ({ position }) => position === this.playerActiveCharacterIndex,
      );
      const moveRange = MOVE_RANGES[selectedCharacter.character.type];
      const attackRange = ATTACK_RANGES[selectedCharacter.character.type];

      if (
        !enemyCharacterClicked &&
        (isDiagonal || isStraight) &&
        rowDistance <= moveRange &&
        columnDistance <= moveRange
      ) {
        this.gamePlay.deselectCell(this.playerActiveCharacterIndex);
        this.gamePlay.deselectCell(index);
        selectedCharacter.position = index;
        this.playerActiveCharacterIndex = null;
        this.gameState.isPlayerTurn = false;

        this.gamePlay.redrawPositions([
          ...this.playerPositionedCharacters,
          ...this.enemyPositionedCharacters,
        ]);
      }

      if (
        enemyCharacterClicked &&
        rowDistance <= attackRange &&
        columnDistance <= attackRange
      ) {
        const { character: attacker } = this.playerPositionedCharacters.find(
          (playerCharacter) => {
            return playerCharacter.position === this.playerActiveCharacterIndex;
          },
        );
        const { character: target } = enemyCharacterClicked;
        const damage = Math.max(
          attacker.attack - target.defence,
          attacker.attack * 0.1,
        );

        target.health -= damage;

        this.gamePlay.deselectCell(this.playerActiveCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gameState.isPlayerTurn = false;
        this.playerActiveCharacterIndex = null;

        this.gamePlay.showDamage(index, damage).then(() => {
          this.gamePlay.redrawPositions([
            ...this.playerPositionedCharacters,
            ...this.enemyPositionedCharacters,
          ]);
        });
      }
    }
  }

  onCellEnter(index) {
    const characterHovered = [
      ...this.playerPositionedCharacters,
      ...this.enemyPositionedCharacters,
    ].find(({ position }) => position === index);
    const playerCharacterHovered = this.playerPositionedCharacters.find(
      (playerCharacter) => {
        return playerCharacter.position === index;
      },
    );
    const enemyCharacterHovered = this.enemyPositionedCharacters.find(
      (enemyCharacter) => {
        return enemyCharacter.position === index;
      },
    );

    if (characterHovered) {
      this.gamePlay.showCellTooltip(
        this.generateMessage(characterHovered),
        index,
      );
    }

    if (playerCharacterHovered) {
      this.gamePlay.setCursor(CURSORS.pointer);
    }

    if (this.playerActiveCharacterIndex !== null) {
      const columnDistance = Math.abs(
        (index % 8) - (this.playerActiveCharacterIndex % 8),
      );
      const rowDistance = Math.abs(
        Math.floor(index / 8) - Math.floor(this.playerActiveCharacterIndex / 8),
      );
      const isStraight = columnDistance === 0 || rowDistance === 0;
      const isDiagonal = rowDistance === columnDistance;
      const selectedCharacter = this.playerPositionedCharacters.find(
        ({ position }) => position === this.playerActiveCharacterIndex,
      );
      const moveRange = MOVE_RANGES[selectedCharacter.character.type];
      const attackRange = ATTACK_RANGES[selectedCharacter.character.type];

      if (
        !characterHovered &&
        (isDiagonal || isStraight) &&
        rowDistance <= moveRange &&
        columnDistance <= moveRange
      ) {
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor(CURSORS.pointer);
      } else if (playerCharacterHovered) {
        this.gamePlay.setCursor(CURSORS.pointer);
      } else if (
        enemyCharacterHovered &&
        rowDistance <= attackRange &&
        columnDistance <= attackRange
      ) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor(CURSORS.crosshair);
      } else {
        this.gamePlay.setCursor(CURSORS.notallowed);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(CURSORS.auto);

    if (index !== this.playerActiveCharacterIndex) {
      this.gamePlay.deselectCell(index);
    }
  }

  generateMessage({ character: { level, attack, defence, health } }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }
}
