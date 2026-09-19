export default class GameState {
  isPlayerTurn = true;
  score = 0;
  maxScore = 0;
  isGameOver = false;

  static from(object) {
    const state = new GameState();

    state.isPlayerTurn = object.isPlayerTurn;
    state.isGameOver = object.isGameOver;
    state.score = object.score;
    state.maxScore = object.maxScore;

    return state;
  }
}
