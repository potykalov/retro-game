import Character from "../Character.js";

class Magician extends Character {
  attack = 10;
  defence = 40;
  type = "magician";

  constructor(level) {
    super(level);
  }
}

export default Magician;
