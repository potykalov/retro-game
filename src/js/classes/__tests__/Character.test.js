import Character from "../Character.js";

describe("Character", () => {
  it("should throw an error when creating the class", () => {
    expect(() => {
      new Character();
    }).toThrow(
      new Error("It is forbidden to create an object of the Character class"),
    );
  });
});
