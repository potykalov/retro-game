import Swordsman from "../Swordsman.js";

describe("Swordsman", () => {
  it("should not throw error when create instance", () => {
    expect(() => {
      new Swordsman(1);
    }).not.toThrow(Error);
  });

  it("should create instance with correct properties", () => {
    const expected = {
      attack: 40,
      defence: 10,
      health: 50,
      level: 1,
      type: "swordsman",
    };

    expect(new Swordsman(1)).toEqual(expected);
  });
});
