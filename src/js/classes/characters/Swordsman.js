import Character from "../Character.js";

class Swordsman extends Character {
  attack = 40;
  defence = 10;
  type = "swordsman";

  constructor(level) {
    super(level);
  }
}

export default Swordsman;
