import Magician from "../Magician.js";

describe("Magician", () => {
  it("should not throw error when creating instance", () => {
    expect(() => {
      new Magician(1);
    }).not.toThrow();
  });

  it("should create instance with correct properties", () => {
    const received = {
      attack: 10,
      defence: 10,
      health: 50,
      level: 1,
      type: "magician",
    };

    expect(new Magician(1)).toEqual(received);
  });
});
