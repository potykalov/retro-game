import { PLAYER_TYPES, ENEMY_TYPES } from "../constants/characterTypes.js";
import CURSORS from "../constants/cursors.js";
import { ATTACK_RANGES, MOVE_RANGES } from "../constants/ranges.js";
import THEMES from "../constants/themes.js";
import { generateTeam } from "../utils/generators.js";
import Bowman from "./characters/Bowman.js";
import Daemon from "./characters/Daemon.js";
import Magician from "./characters/Magician.js";
import Swordsman from "./characters/Swordsman.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";
import GamePlay from "./GamePlay.js";
import GameState from "./GameState.js";
import PositionedCharacter from "./PositionedCharacter.js";

export default class GameController {
  playerActiveCharacterIndex = null;
  gameState = new GameState();
  enemyTurnCount = 0;
  gameLevel = 1;
  isRestarting = false;

  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(THEMES.prairie);
    const playerTeam = generateTeam(PLAYER_TYPES, 1, 4);
    const enemyTeam = generateTeam(ENEMY_TYPES, this.gameLevel, 4);
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

    this.gamePlay.addNewGameListener(() => {
      this.onNewGame();
    });

    this.gamePlay.addCellClickListener((index) => {
      this.onCellClick(index);
    });

    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
    });

    this.gamePlay.addCellLeaveListener((index) => {
      this.onCellLeave(index);
    });

    this.gamePlay.addSaveGameListener(() => {
      this.onSaveGame();
    });

    this.gamePlay.addLoadGameListener(() => {
      this.onLoadGame();
    });

    if (!this.isRestarting) {
      this.onLoadGame();
    }
  }

  onCellClick(index) {
    if (this.gameState.isGameOver) return;

    if (this.gameState.isPlayerTurn === false) {
      this.gamePlay.setCursor(CURSORS.auto);
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

      this.gamePlay.cells.forEach((cell, index) => {
        cell.style.outline = "";
        cell.style.outlineOffset = "";

        const columnDistance = Math.abs(
          (index % 8) - (this.playerActiveCharacterIndex % 8),
        );
        const rowDistance = Math.abs(
          Math.floor(index / 8) -
            Math.floor(this.playerActiveCharacterIndex / 8),
        );
        const isStraight = columnDistance === 0 || rowDistance === 0;
        const isDiagonal = rowDistance === columnDistance;
        const moveRange = MOVE_RANGES[playerCharacterClicked.character.type];
        const attackRange =
          ATTACK_RANGES[playerCharacterClicked.character.type];
        const isPlayer = this.playerPositionedCharacters.some(
          ({ position }) => position === index,
        );
        const isEnemy = this.enemyPositionedCharacters.some(
          ({ position }) => position === index,
        );

        if (
          !isPlayer &&
          !isEnemy &&
          (isDiagonal || isStraight) &&
          rowDistance <= moveRange &&
          columnDistance <= moveRange
        ) {
          cell.style.outline = "2px solid #2563eb";
          cell.style.outlineOffset = "-5px";
        }

        if (
          isEnemy &&
          rowDistance <= attackRange &&
          columnDistance <= attackRange
        ) {
          cell.style.outline = "2px solid #ff6b6b";
          cell.style.outlineOffset = "-5px";
        }
      });

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

        this.gamePlay.cells.forEach((cell) => {
          cell.style.outline = "";
          cell.style.outlineOffset = "";
        });

        this.gamePlay.redrawPositions([
          ...this.playerPositionedCharacters,
          ...this.enemyPositionedCharacters,
        ]);

        this.turnEnemy();
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
        const damage = Math.round(
          Math.max(attacker.attack - target.defence, attacker.attack * 0.1),
        );

        target.health -= damage;

        this.checkHealth(enemyCharacterClicked, this.enemyPositionedCharacters);

        this.gamePlay.deselectCell(this.playerActiveCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gameState.isPlayerTurn = false;
        this.playerActiveCharacterIndex = null;
        this.gamePlay.setCursor(CURSORS.auto);

        this.gamePlay.cells.forEach((cell) => {
          cell.style.outline = "";
          cell.style.outlineOffset = "";
        });

        this.gamePlay.showDamage(index, damage).then(() => {
          this.gamePlay.redrawPositions([
            ...this.playerPositionedCharacters,
            ...this.enemyPositionedCharacters,
          ]);

          if (this.enemyPositionedCharacters.length === 0) {
            this.nextLevel();
            return;
          }

          this.turnEnemy();
        });
      }
    }
  }

  onCellEnter(index) {
    if (this.gameState.isGameOver) return;

    if (this.gameState.isPlayerTurn === false) {
      this.gamePlay.setCursor(CURSORS.auto);
      return;
    }

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
    if (this.gameState.isGameOver) return;

    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(CURSORS.auto);

    if (index !== this.playerActiveCharacterIndex) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGame() {
    if (this.isRestarting) return;

    this.isRestarting = true;

    this.gameState.isGameOver = false;
    this.gameState.isPlayerTurn = true;
    this.gameState.score = 0;
    this.gameLevel = 1;
    this.enemyTurnCount = 0;
    this.playerActiveCharacterIndex = null;

    this.init();

    setTimeout(() => {
      this.isRestarting = false;
    }, 1000);
  }

  generateMessage({ character: { level, attack, defence, health } }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }

  turnEnemy() {
    this.enemyTurnCount += 1;

    const shouldMove = this.enemyTurnCount % 5 === 0;
    let targets = [];

    this.enemyPositionedCharacters.forEach((enemy) => {
      this.playerPositionedCharacters.forEach((player) => {
        const columnDistance = Math.abs(
          (enemy.position % 8) - (player.position % 8),
        );
        const rowDistance = Math.abs(
          Math.floor(enemy.position / 8) - Math.floor(player.position / 8),
        );
        const attackRange = ATTACK_RANGES[enemy.character.type];
        const damage = Math.round(
          Math.max(
            enemy.character.attack - player.character.defence,
            enemy.character.attack * 0.1,
          ),
        );

        if (columnDistance <= attackRange && rowDistance <= attackRange) {
          targets.push({
            enemy,
            player,
            damage,
          });
        }
      });
    });

    if (targets.length > 0 && !shouldMove) {
      targets.sort((a, b) => b.damage - a.damage);

      const bestTarget = targets[0];
      const { player, damage } = bestTarget;

      player.character.health -= damage;

      this.checkHealth(player, this.playerPositionedCharacters);
      this.gamePlay.showDamage(player.position, damage).then(() => {
        this.gameState.isPlayerTurn = true;
        this.gamePlay.redrawPositions([
          ...this.playerPositionedCharacters,
          ...this.enemyPositionedCharacters,
        ]);

        if (this.playerPositionedCharacters.length === 0) {
          this.gameState.isPlayerTurn = false;
          this.gameState.isGameOver = true;

          if (this.gameState.score > this.gameState.maxScore) {
            GamePlay.showMessage(`Игра окончена. Ваш отряд уничтожен.
Вы получили ${this.gameState.score} очков.
Новый рекорд!`);

            this.gameState.maxScore = this.gameState.score;

            return;
          }

          GamePlay.showMessage(`Игра окончена. Ваш отряд уничтожен.
Вы получили ${this.gameState.score} очков.
Рекорд: ${this.gameState.maxScore} очков.`);

          return;
        }
      });
    } else {
      const enemyIndex = Math.floor(
        Math.random() * this.enemyPositionedCharacters.length,
      );
      const movingEnemy = this.enemyPositionedCharacters[enemyIndex];
      const enemyColumn = Math.abs(movingEnemy.position % 8);
      const enemyRow = Math.abs(Math.floor(movingEnemy.position / 8));
      const playerIndex = Math.floor(
        Math.random() * this.playerPositionedCharacters.length,
      );
      const targetPlayer = this.playerPositionedCharacters[playerIndex];
      const playerColumn = Math.abs(targetPlayer.position % 8);
      const playerRow = Math.abs(Math.floor(targetPlayer.position / 8));
      const moves = [];
      const occupiedMoves = [
        ...this.enemyPositionedCharacters,
        ...this.playerPositionedCharacters,
      ].map(({ position }) => position);

      for (let i = 0; i < 8 ** 2; i += 1) {
        if (occupiedMoves.includes(i)) {
          continue;
        }

        const columnDistance = Math.abs((movingEnemy.position % 8) - (i % 8));
        const rowDistance = Math.abs(
          Math.floor(movingEnemy.position / 8) - Math.floor(i / 8),
        );
        const isStraight = columnDistance === 0 || rowDistance === 0;
        const isDiagonal = rowDistance === columnDistance;
        const moveRange = MOVE_RANGES[movingEnemy.character.type];

        if (
          columnDistance <= moveRange &&
          rowDistance <= moveRange &&
          (isStraight || isDiagonal)
        ) {
          moves.push(i);
        }
      }

      let bestPosition = movingEnemy.position;
      let bestDistance = Math.max(
        Math.abs(enemyColumn - playerColumn),
        Math.abs(enemyRow - playerRow),
      );

      for (const position of moves) {
        const columnDistance = Math.abs((position % 8) - playerColumn);
        const rowDistance = Math.abs(Math.floor(position / 8) - playerRow);

        const distance = Math.max(columnDistance, rowDistance);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestPosition = position;
        }
      }

      movingEnemy.position = bestPosition;

      this.gamePlay.redrawPositions([
        ...this.playerPositionedCharacters,
        ...this.enemyPositionedCharacters,
      ]);

      this.gameState.isPlayerTurn = true;
    }
  }

  checkHealth(target, team) {
    if (target.character.health <= 0) {
      const index = team.indexOf(target);

      team.splice(index, 1);

      if (team === this.enemyPositionedCharacters) {
        this.gameState.score += 10;
      }
    }
  }

  nextLevel() {
    this.gameLevel += 1;

    this.playerPositionedCharacters.forEach(({ character }) => {
      character.levelUp();
    });

    const playerStartCells = [
      0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
    ];

    const enemyStartCells = [
      6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
    ];

    this.playerPositionedCharacters.forEach((player) => {
      const randomIndex = Math.floor(Math.random() * playerStartCells.length);

      player.position = playerStartCells[randomIndex];
      playerStartCells.splice(randomIndex, 1);
    });

    const enemyTeam = generateTeam(ENEMY_TYPES, this.gameLevel, 4);

    this.enemyPositionedCharacters = enemyTeam.characters.map((character) => {
      const randomIndex = Math.floor(Math.random() * enemyStartCells.length);

      const positionedCharacter = new PositionedCharacter(
        character,
        enemyStartCells[randomIndex],
      );

      enemyStartCells.splice(randomIndex, 1);

      return positionedCharacter;
    });

    this.playerActiveCharacterIndex = null;
    this.enemyTurnCount = 0;

    const themes = Object.values(THEMES);
    const themeIndex = (this.gameLevel - 1) % themes.length;
    const currentTheme = themes[themeIndex];

    this.gamePlay.drawUi(currentTheme);

    this.gamePlay.redrawPositions([
      ...this.playerPositionedCharacters,
      ...this.enemyPositionedCharacters,
    ]);

    this.gamePlay.setCursor(CURSORS.auto);
    this.gameState.isPlayerTurn = true;
  }

  onSaveGame() {
    const data = {
      gameLevel: this.gameLevel,
      isPlayerTurn: this.gameState.isPlayerTurn,
      playerPositions: this.playerPositionedCharacters,
      enemyPositions: this.enemyPositionedCharacters,
      score: this.gameState.score,
      maxScore: this.gameState.maxScore,
      isGameOver: this.gameState.isGameOver,
    };

    this.stateService.save(data);
  }

  onLoadGame() {
    try {
      const data = this.stateService.load();

      if (!data) return;

      const { playerPositions, enemyPositions, gameLevel } = data;

      const restoredPlayerPositions = playerPositions.map(
        ({ character: character, position }) => {
          let restoredCharacter;

          if (character.type === "bowman")
            restoredCharacter = new Bowman(character.level);

          if (character.type === "magician")
            restoredCharacter = new Magician(character.level);

          if (character.type === "swordsman")
            restoredCharacter = new Swordsman(character.level);

          Object.assign(restoredCharacter, character);

          return new PositionedCharacter(restoredCharacter, position);
        },
      );

      const restoredEnemyPositions = enemyPositions.map(
        ({ character: character, position }) => {
          let restoredCharacter;

          if (character.type === "daemon")
            restoredCharacter = new Daemon(character.level);

          if (character.type === "undead")
            restoredCharacter = new Undead(character.level);

          if (character.type === "vampire")
            restoredCharacter = new Vampire(character.level);

          Object.assign(restoredCharacter, character);

          return new PositionedCharacter(restoredCharacter, position);
        },
      );

      this.gameLevel = gameLevel;
      this.playerActiveCharacterIndex = null;

      this.gameState = GameState.from(data);

      const themes = Object.values(THEMES);
      const themeIndex = (this.gameLevel - 1) % themes.length;
      const currentTheme = themes[themeIndex];

      this.gamePlay.drawUi(currentTheme);

      this.playerPositionedCharacters = restoredPlayerPositions;
      this.enemyPositionedCharacters = restoredEnemyPositions;

      this.gamePlay.redrawPositions([
        ...this.playerPositionedCharacters,
        ...this.enemyPositionedCharacters,
      ]);
    } catch {
      GamePlay.showError("Не удалось загрузить сохранённую игру");
    }
  }
}
