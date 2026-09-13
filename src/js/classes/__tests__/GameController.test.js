import GameController from "../GameController.js";
import cursors from "../../constants/cursors.js";

describe("generateMessage", () => {
  const cases = [
    {
      character: {
        level: 1,
        attack: 25,
        defence: 25,
        health: 50,
        type: "vampire",
      },
      expected: "\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50",
    },
    {
      character: {
        level: 2,
        attack: 10,
        defence: 10,
        health: 50,
        type: "magician",
      },
      expected: "\u{1F396}2 \u{2694}10 \u{1F6E1}10 \u{2764}50",
    },
    {
      character: {
        level: 3,
        attack: 40,
        defence: 10,
        health: 50,
        type: "undead",
      },
      expected: "\u{1F396}3 \u{2694}40 \u{1F6E1}10 \u{2764}50",
    },
    {
      character: {
        level: 4,
        attack: 25,
        defence: 25,
        health: 50,
        type: "bowman",
      },
      expected: "\u{1F396}4 \u{2694}25 \u{1F6E1}25 \u{2764}50",
    },
    {
      character: {
        level: 5,
        attack: 40,
        defence: 10,
        health: 50,
        type: "swordsman",
      },
      expected: "\u{1F396}5 \u{2694}40 \u{1F6E1}10 \u{2764}50",
    },
    {
      character: {
        level: 6,
        attack: 10,
        defence: 10,
        health: 50,
        type: "daemon",
      },
      expected: "\u{1F396}6 \u{2694}10 \u{1F6E1}10 \u{2764}50",
    },
  ];

  it.each(cases)(
    "should return a tooltip for $character.type",
    ({ character, expected }) => {
      const gameController = new GameController();

      expect(gameController.generateMessage({ character })).toBe(expected);
    },
  );
});

describe("onCellEnter", () => {
  let gameController;
  let gamePlay;

  beforeEach(() => {
    gamePlay = {
      setCursor: jest.fn(),
      selectCell: jest.fn(),
      showCellTooltip: jest.fn(),
    };

    gameController = new GameController(gamePlay);
    gameController.savedIndex = 0;
    gameController.playerPositions = [];
    gameController.enemyPositions = [];
  });

  it("should allow swordsman to move 4 cells", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "swordsman" } },
    ];

    gameController.onCellEnter(4);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "green");
  });

  it("should prevent swordsman from moving 5 cells", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "swordsman" } },
    ];

    gameController.onCellEnter(5);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should allow bowman to move 2 cells diagonally", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "bowman" } },
    ];

    gameController.onCellEnter(18);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(18, "green");
  });

  it("should prevent bowman from moving 3 cells", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "bowman" } },
    ];

    gameController.onCellEnter(3);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should allow magician to move 1 cell", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "magician" } },
    ];

    gameController.onCellEnter(1);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "green");
  });

  it("should prevent magician from moving 2 cells", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "magician" } },
    ];

    gameController.onCellEnter(2);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should prevent moving 2 rows and 1 column", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "bowman" } },
    ];

    gameController.onCellEnter(17);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should allow swordsman to attack an adjacent enemy", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "swordsman" } },
    ];
    gameController.enemyPositions = [
      { position: 1, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(1);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(1, "red");
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);
  });

  it("should prevent swordsman from attacking 2 cells away", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "swordsman" } },
    ];
    gameController.enemyPositions = [
      { position: 2, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(2);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should allow bowman to attack 2 rows and 1 column away", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "bowman" } },
    ];
    gameController.enemyPositions = [
      { position: 17, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(17);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(17, "red");
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);
  });

  it("should prevent bowman from attacking 3 cells away", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "bowman" } },
    ];
    gameController.enemyPositions = [
      { position: 3, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(3);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });

  it("should allow magician to attack 4 cells away", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "magician" } },
    ];
    gameController.enemyPositions = [
      { position: 4, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(4);

    expect(gamePlay.selectCell).toHaveBeenCalledWith(4, "red");
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);
  });

  it("should prevent magician from attacking 5 cells away", () => {
    gameController.playerPositions = [
      { position: 0, character: { type: "magician" } },
    ];
    gameController.enemyPositions = [
      { position: 5, character: { type: "vampire" } },
    ];

    gameController.onCellEnter(5);

    expect(gamePlay.selectCell).not.toHaveBeenCalled();
    expect(gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
  });
});
