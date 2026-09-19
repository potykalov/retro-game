// Базовый класс, от которого наследуются классы персонажей
class Character {
  constructor(level, type = "generic") {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    if (new.target === Character) {
      throw new Error("Directly creating the class Character is prohibited");
    }
  }

  levelUp() {
    this.level += 1;
    this.attack = Math.round(
      Math.max(this.attack, (this.attack * (80 + this.health)) / 100),
    );
    this.defence = Math.round(
      Math.max(this.defence, (this.defence * (80 + this.health)) / 100),
    );
    this.health = Math.min(this.health + 80, 100);
  }
}

export default Character;
