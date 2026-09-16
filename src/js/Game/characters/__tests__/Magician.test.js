import Magician from "../Magician.js";

describe("Magician", () => {
  it("should not throw error when create instance", () => {
    expect(() => {
      new Magician(1);
    }).not.toThrow(Error);
  });

  it("should create instance with correct properties", () => {
    const expected = {
      attack: 10,
      defence: 40,
      health: 50,
      level: 1,
      type: "magician",
    };

    expect(new Magician(1)).toEqual(expected);
  });
});
