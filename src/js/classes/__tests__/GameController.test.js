import GameController from "../GameController.js";

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
