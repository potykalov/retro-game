import GameController from "../GameController.js";

describe("GameController.generateMessage", () => {
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
    "should returns a tooltip with stats for $characterHovered.character.type",
    ({ characterHovered, expected }) => {
      expect(gameController.generateMessage(characterHovered)).toBe(expected);
    },
  );
});
