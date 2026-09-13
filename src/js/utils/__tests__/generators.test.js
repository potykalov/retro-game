import Undead from "../../classes/characters/Undead.js";
import Vampire from "../../classes/characters/Vampire.js";
import Daemon from "../../classes/characters/Daemon.js";
import { characterGenerator, generateTeam } from "../generators.js";
import Bowman from "../../classes/characters/Bowman.js";
import Swordsman from "../../classes/characters/Swordsman.js";
import Magician from "../../classes/characters/Magician.js";

describe("characterGenerator", () => {
  const allowedTypes = [Vampire, Undead, Daemon];

  it("should keep yielding characters without finishing", () => {
    const generator = characterGenerator(allowedTypes, 4);

    for (let i = 0; i < 10; i++) {
      const { done } = generator.next();

      expect(done).toBeFalsy();
    }
  });

  it("should yield characters of allowed types", () => {
    const generator = characterGenerator(allowedTypes, 4);

    for (let i = 0; i < 10; i++) {
      const { value } = generator.next();

      const isAllowed =
        value instanceof Vampire ||
        value instanceof Undead ||
        value instanceof Daemon;

      expect(isAllowed).toBeTruthy();
    }
  });
});

describe("generateTeam", () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const { characters } = generateTeam(playerTypes, 3, 4);

  it("should create the requested number of characters", () => {
    expect(characters).toHaveLength(4);
  });

  it("should create characters within the level range", () => {
    characters.forEach(({ level }) => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(4);
    });
  });
});
