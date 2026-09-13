import Bowman from "../Bowman.js";

describe("Bowman", () => {
  it("should not throw error when creating instance", () => {
    expect(() => {
      new Bowman(1);
    }).not.toThrow();
  });

  it("should create instance with correct properties", () => {
    const received = {
      attack: 25,
      defence: 25,
      health: 50,
      level: 1,
      type: "bowman",
    };

    expect(new Bowman(1)).toEqual(received);
  });
});
