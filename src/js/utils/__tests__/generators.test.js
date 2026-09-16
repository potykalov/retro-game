import Bowman from "../../Game/characters/Bowman.js";
import Magician from "../../Game/characters/Magician.js";
import Swordsman from "../../Game/characters/Swordsman.js";
import { characterGenerator, generateTeam } from "../generators.js";

const allowedTypes = [Bowman, Swordsman, Magician];

describe("characterGenerator", () => {
  it("should not stop generate random characters", () => {
    const generator = characterGenerator(allowedTypes, 4);

    for (let i = 0; i < 10; i++) {
      expect(generator.next().done).toBeFalsy();
    }
  });
});

describe("generateTeam", () => {
  it("should create a team with the required number of characters", () => {
    for (let i = 1; i < 5; i++) {
      const maxLevel = Math.floor(Math.random() * i) + 1;
      const team = generateTeam(allowedTypes, maxLevel, i).characters;

      expect(team).toHaveLength(i);

      team.forEach((character) => {
        expect(character.level).toBeGreaterThanOrEqual(1);
        expect(character.level).toBeLessThan(5);
      });
    }
  });

  it("should create a team with levels within the specified range", () => {
    for (let i = 0; i < 5; i++) {
      const maxLevel = Math.floor(Math.random() * i) + 1;
      const team = generateTeam(allowedTypes, maxLevel, i).characters;

      team.forEach((character) => {
        expect(character.level).toBeGreaterThanOrEqual(1);
        expect(character.level).toBeLessThan(5);
      });
    }
  });
});
