import Character from "../Character.js";

describe("Character", () => {
  it("should throw error when try create class", () => {
    expect(() => {
      new Character();
    }).toThrow(Error);
  });
});
