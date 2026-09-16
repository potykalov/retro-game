import { calcTileType } from "../utils.js";

describe("calcTileType", () => {
  const cases = [
    { index: 0, boardSize: 8, expected: "top-left" },
    { index: 1, boardSize: 8, expected: "top" },
    { index: 6, boardSize: 8, expected: "top" },
    { index: 7, boardSize: 8, expected: "top-right" },
    { index: 8, boardSize: 8, expected: "left" },
    { index: 9, boardSize: 8, expected: "center" },
    { index: 27, boardSize: 8, expected: "center" },
    { index: 54, boardSize: 8, expected: "center" },
    { index: 55, boardSize: 8, expected: "right" },
    { index: 56, boardSize: 8, expected: "bottom-left" },
    { index: 57, boardSize: 8, expected: "bottom" },
    { index: 62, boardSize: 8, expected: "bottom" },
    { index: 63, boardSize: 8, expected: "bottom-right" },
  ];

  it.each(cases)(
    "should return $expected for $index cell",
    ({ index, boardSize, expected }) => {
      expect(calcTileType(index, boardSize)).toBe(expected);
    },
  );
});
