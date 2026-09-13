import Character from "../Character.js";

class Daemon extends Character {
  attack = 10;
  defence = 10;
  type = "daemon";

  constructor(level) {
    super(level);
  }
}

export default Daemon;
