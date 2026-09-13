import Swordsman from "../Swordsman.js";

describe("Swordsman", () => {
  it("should not throw error when creating instance", () => {
    expect(() => {
      new Swordsman(1);
    }).not.toThrow();
  });

  it("should create instance with correct properties", () => {
    const received = {
      attack: 40,
      defence: 10,
      health: 50,
      level: 1,
      type: "swordsman",
    };

    expect(new Swordsman(1)).toEqual(received);
  });
});
