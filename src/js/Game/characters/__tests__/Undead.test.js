import Undead from "../Undead.js";

describe("Undead", () => {
  it("should not throw error when create instance", () => {
    expect(() => {
      new Undead(1);
    }).not.toThrow(Error);
  });

  it("should create instance with correct properties", () => {
    const expected = {
      attack: 25,
      defence: 25,
      health: 50,
      level: 1,
      type: "undead",
    };

    expect(new Undead(1)).toEqual(expected);
  });
});
