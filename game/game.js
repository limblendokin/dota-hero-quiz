const AllPick = require('./modes/AllPick');
const SingleDraft = require('./modes/SingleDraft');
const AllRandom = require('./modes/AllRandom');
class Game {
  static #gamemodes = {
    unranked: {
      allPick: AllPick,
      singleDraft: SingleDraft,
      allRandom: AllRandom,
    },
  };
  static async newGame(queueType, mode) {
    return new Game(await Game.#gamemodes[queueType][mode].newGame());
  }
  static loadGame({ queueType, mode, ...state }) {
    return new Game(Game.#gamemodes[queueType][mode].loadGame(state));
  }
  constructor(gamemode) {
    this.gamemode = gamemode;
  }
  submitAnswer(answer) {
    this.gamemode.submitAnswer(answer);
  }

  requestNewVo() {
    this.gamemode.getNextVo();
  }
  getPublicState() {
    return this.gamemode.getPublicState();
  }
}
