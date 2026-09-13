import Character from "../Character.js";

class Undead extends Character {
  attack = 40;
  defence = 10;
  type = "undead";

  constructor(level) {
    super(level);
  }
}

export default Undead;
