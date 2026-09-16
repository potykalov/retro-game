import Vampire from "../Vampire.js";

describe("Vampire", () => {
  it("should not throw error when create instance", () => {
    expect(() => {
      new Vampire(1);
    }).not.toThrow(Error);
  });

  it("should create instance with correct properties", () => {
    const expected = {
      attack: 25,
      defence: 25,
      health: 50,
      level: 1,
      type: "vampire",
    };

    expect(new Vampire(1)).toEqual(expected);
  });
});
