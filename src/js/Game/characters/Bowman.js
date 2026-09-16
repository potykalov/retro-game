import Character from "../Character.js";

class Bowman extends Character {
  attack = 25;
  defence = 25;
  type = "bowman";

  constructor(level) {
    super(level);
  }
}

export default Bowman;
