import Character from "../Character.js";

class Bowman extends Character {
  defence = 25;
  attack = 25;
  type = "bowman";

  constructor(level) {
    super(level);
  }
}

export default Bowman;
