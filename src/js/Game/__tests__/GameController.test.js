import CURSORS from "../../constants/cursors.js";
import GameController from "../GameController.js";

describe("GameController", () => {
  describe("generateMessage", () => {
    const cases = [
      {
        characterHovered: {
          character: {
            level: 1,
            attack: 25,
            defence: 25,
            health: 50,
            type: "vampire",
          },
          position: 47,
        },
        expected: "\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50",
      },
      {
        characterHovered: {
          character: {
            level: 3,
            attack: 10,
            defence: 10,
            health: 50,
            type: "daemon",
          },
          position: 23,
        },
        expected: "\u{1F396}3 \u{2694}10 \u{1F6E1}10 \u{2764}50",
      },
      {
        characterHovered: {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 2,
            type: "magician",
          },
          position: 54,
        },
        expected: "\u{1F396}2 \u{2694}10 \u{1F6E1}40 \u{2764}50",
      },
    ];
    const gameController = new GameController();

    it.each(cases)(
      "should return a tooltip with stats for $characterHovered.character.type",
      ({ characterHovered, expected }) => {
        expect(gameController.generateMessage(characterHovered)).toBe(expected);
      },
    );
  });

  describe("onCellEnter for bowman", () => {
    it("should highlight cell green and set pointer cursor 2 cells to right of selected bowman", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(29);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(29, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor 3 cells to right of selected bowman", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(30);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor when enemy is within bowman attack range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 29,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(29);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(29, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor when enemy is outside bowman attack range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 30,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(30);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(25);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(25, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond bowman range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 25,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(25);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(25, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 24,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(11);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(11, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond bowman range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 11,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(11);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(11, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 3,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(43);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(43, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond bowman range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(51);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 43,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(43);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(43, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 51,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(51);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid top-right diagonal bowman move", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(13);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(13, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a top-right diagonal move beyond bowman range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range diagonally top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 13,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(13);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(13, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range diagonally top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 6,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a bowman move 1 column top and 2 rows right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for a bowman attack 1 column top and 2 rows right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should highlight cell green and set pointer cursor for a valid bottom-right diagonal bowman move", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(45, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a bottom-right diagonal move beyond bowman range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range diagonally bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(45, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range diagonally bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 54,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a bowman move 2 columns bottom and 1 row right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(44);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for a bowman attack 2 columns bottom and 1 row right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 44,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(44);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(44, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should highlight cell green and set pointer cursor for a valid bottom-left diagonal bowman move", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(41);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(41, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a bottom-left diagonal move beyond bowman range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range diagonally bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 41,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(41);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(41, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range diagonally bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 48,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a bowman move 2 columns bottom and 1 row left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for a bowman attack 2 columns bottom and 1 row left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(42, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should highlight cell green and set pointer cursor for a valid top-left diagonal bowman move", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a top-left diagonal move beyond bowman range", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(0);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within bowman attack range diagonally top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 9,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond bowman attack range diagonally top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(0);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a bowman move 1 row top and 2 columns left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for a bowman attack 1 row top and 2 columns left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 10,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(17, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });
  });

  describe("onCellEnter for swordsman", () => {
    it("should highlight cell green and set pointer cursor for a valid swordsman move to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 1,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(1);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 2,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(3, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 6,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(6, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 5,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(24, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 48,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(48, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 40,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(32, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 8,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(8);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(8, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 16,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(28, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 49,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(49);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(49, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(36, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 9,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 18,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(35, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 14,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(14);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(14, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid swordsman move to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(27, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond swordsman range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within swordsman attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 54,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(54, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond swordsman attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal swordsman move to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal swordsman attack to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal swordsman move to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal swordsman attack to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal swordsman move to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal swordsman attack to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 33,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal swordsman move to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal swordsman attack to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 37,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "swordsman",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });
  });

  describe("onCellEnter for magician", () => {
    it("should highlight cell green and set pointer cursor for a valid magician move to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(1);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 4,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 5,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(6, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 3,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(3, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 2,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(48, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 24,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(24, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 16,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(8);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(8, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 32,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(32, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 40,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(49);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(49, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 28,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(28, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 36,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(36, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(14);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(14, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 35,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(35, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid magician move to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(54, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond magician range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within magician attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(27, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond magician attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 18,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal magician move to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal magician attack to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal magician move to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal magician attack to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(17, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal magician move to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal magician attack to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 33,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(33, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal magician move to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal magician attack to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 37,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "magician",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(37, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });
  });

  describe("onCellEnter for vampire", () => {
    it("should highlight cell green and set pointer cursor for a valid vampire move to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(2, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 2,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(2, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 3,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(5, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 5,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(5, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 4,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(40, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 40,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(40, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 32,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(16, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 16,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(16, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 24,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(42, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(42, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 35,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(18, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 18,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(18, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 28,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid vampire move to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(45, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond vampire range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within vampire attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(45, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond vampire attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 36,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal vampire move to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal vampire attack to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal vampire move to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal vampire attack to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(17, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal vampire move to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal vampire attack to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 33,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(33, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal vampire move to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal vampire attack to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 37,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "vampire",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(37, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });
  });

  describe("onCellEnter for undead", () => {
    it("should highlight cell green and set pointer cursor for a valid undead move to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 1,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(1);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 2,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(3, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 6,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(6, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 5,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(24, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 48,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(48, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 40,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(32, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 8,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(8);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(8, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 16,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(28, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 49,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(49);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(49, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(36, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 9,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 18,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(35, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 14,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(14);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(14, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid undead move to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(27, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond undead range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within undead attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 54,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(54, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond undead attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal undead move to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal undead attack to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal undead move to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal undead attack to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal undead move to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal undead attack to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 33,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal undead move to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight enemy cell and set notallowed cursor for an off-diagonal undead attack to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 37,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 40,
            defence: 10,
            health: 50,
            level: 1,
            type: "undead",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });
  });

  describe("onCellEnter for daemon", () => {
    it("should highlight cell green and set pointer cursor for a valid daemon move to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(1);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 4,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(4);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 5,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(6);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(6, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(5);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 3,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(3);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(3, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 2,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(2);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(48);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(48, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 24,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(24);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(24, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the top", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 16,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(8);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(8, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(16);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 32,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(32);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(32, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the bottom", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 40,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(40);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(49);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(49, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 28,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(28);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(28, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the top-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 56;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 56,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(9);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(9, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 36,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(36);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(36, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the bottom-right", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 45,
        },
      ];
      gameController.playerActiveCharacterIndex = 0;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 0,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(14);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(14, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 35,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(35);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(35, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the bottom-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 42,
        },
      ];
      gameController.playerActiveCharacterIndex = 7;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 7,
        },
      ];
      gameController.onCellEnter(42);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight cell green and set pointer cursor for a valid daemon move to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(54);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(54, "green");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.pointer);
    });

    it("should not highlight cell and set notallowed cursor for a move beyond daemon range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(45);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an enemy within daemon attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 27,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(27);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(27, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight enemy cell and set notallowed cursor for an enemy beyond daemon attack range to the top-left", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 18,
        },
      ];
      gameController.playerActiveCharacterIndex = 63;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 63,
        },
      ];
      gameController.onCellEnter(18);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal daemon move to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal daemon attack to cell 21", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 21,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(21);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(21, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal daemon move to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal daemon attack to cell 17", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 17,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(17);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(17, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal daemon move to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal daemon attack to cell 33", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 33,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(33);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(33, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });

    it("should not highlight cell and set notallowed cursor for a non-straight non-diagonal daemon move to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).not.toHaveBeenCalled();
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.notallowed);
    });

    it("should highlight enemy cell red and set crosshair cursor for an off-diagonal daemon attack to cell 37", () => {
      const gamePlay = {
        selectCell: jest.fn(),
        setCursor: jest.fn(),
        showCellTooltip: jest.fn(),
      };
      const gameController = new GameController(gamePlay);

      gameController.enemyPositionedCharacters = [
        {
          character: {
            attack: 25,
            defence: 25,
            health: 50,
            level: 1,
            type: "bowman",
          },
          position: 37,
        },
      ];
      gameController.playerActiveCharacterIndex = 27;
      gameController.playerPositionedCharacters = [
        {
          character: {
            attack: 10,
            defence: 40,
            health: 50,
            level: 1,
            type: "daemon",
          },
          position: 27,
        },
      ];
      gameController.onCellEnter(37);

      expect(gamePlay.selectCell).toHaveBeenCalledWith(37, "red");
      expect(gamePlay.setCursor).toHaveBeenCalledWith(CURSORS.crosshair);
    });
  });
});
