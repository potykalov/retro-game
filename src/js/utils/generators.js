// Формирует экземпляр персонажа из массива allowedTypes со
// случайным уровнем от 1 до maxLevel

import Team from "../classes/Team.js";

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const index = Math.floor(Math.random() * allowedTypes.length);
    const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
    yield new allowedTypes[index](randomLevel);
  }
}

// Формирует массив персонажей на основе characterGenerator

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];
  const generator = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    characters.push(generator.next().value);
  }

  return new Team(characters);
}
