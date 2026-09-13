import Character from "../Character.js";

class Vampire extends Character {
  attack = 25;
  defence = 25;
  type = "vampire";

  constructor(level) {
    super(level);
  }
}

export default Vampire;
