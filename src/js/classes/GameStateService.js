// Объект, который взаимодействует с текущим состоянием
// (сохраняет данные в localStorage для последующей загрузки)

export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem("state", JSON.stringify(state));
  }

  //   load() {
  //     try {
  //       return JSON.parse(this.storage.getItem("state"));
  //     } catch (e) {
  //       throw new Error("Invalid state");
  //     }
  //   }
}
