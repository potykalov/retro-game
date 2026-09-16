import Character from "../Character.js";

class Undead extends Character {
  attack = 25;
  defence = 25;
  type = "undead";

  constructor(level) {
    super(level);
  }
}

export default Undead;
