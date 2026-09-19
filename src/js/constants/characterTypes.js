import Bowman from "../Game/characters/Bowman.js";
import Daemon from "../Game/characters/Daemon.js";
import Magician from "../Game/characters/Magician.js";
import Swordsman from "../Game/characters/Swordsman.js";
import Undead from "../Game/characters/Undead.js";
import Vampire from "../Game/characters/Vampire.js";

const PLAYER_TYPES = [Bowman, Swordsman, Magician];
const ENEMY_TYPES = [Vampire, Undead, Daemon];

export { PLAYER_TYPES, ENEMY_TYPES };
