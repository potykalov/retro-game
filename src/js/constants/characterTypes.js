import Bowman from "../game/characters/Bowman.js";
import Daemon from "../game/characters/Daemon.js";
import Magician from "../game/characters/Magician.js";
import Swordsman from "../game/characters/Swordsman.js";
import Undead from "../game/characters/Undead.js";
import Vampire from "../game/characters/Vampire.js";

const PLAYER_TYPES = [Bowman, Swordsman, Magician];
const ENEMY_TYPES = [Vampire, Undead, Daemon];

export { PLAYER_TYPES, ENEMY_TYPES };
