// Базовый класс, от которого наследуются и
// реализовываются специализированные персонажи

export default class Character {
  constructor(level, type = "generic") {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    if (new.target.name === "Character")
      throw new Error(
        "It is forbidden to create an object of the Character class",
      );
  }
}
