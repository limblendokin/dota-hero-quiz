const heroesList = require('../../herolist.json');
const fs = require('fs');
require('dotenv').config();
module.exports = class SingleDraft {
  static #publicFields = ['round', 'points', 'lives', 'selectedHeroIds'];
  static #selectVos = async (selectedHeroIds) => {
    const randomHeroId =
      selectedHeroIds[Math.floor(selectedHeroIds.length * Math.random())];
    const availibleVoPaths = await new Promise((resolve, reject) => {
      const randomHeroLegacyName = heroesList.find(
        (hero) => hero.id === randomHeroId
      ).legacyName;
      fs.readdir(
        process.env.PATH_TO_VOICE_LINES + '/' + randomHeroLegacyName,
        (err, files) => {
          if (err) {
            reject(err);
          }
          resolve(files);
        }
      );
    });
    const randomFileName =
      availibleVoPaths[Math.floor(availibleVoPaths.length * Math.random())];
    const randomVoPath = process.env.PATH_TO_VOICE_LINES + '/' + randomFileName;
    return [{ heroId: randomHeroId, path: randomVoPath }];
  };
  static #selectHeroes = () => {
    const selectedHeroIds = [];
    let randomHeroId = Math.floor(heroesList.length * Math.random());
    for (let index = 0; index < 3; index++) {
      while (selectedHeroIds.includes(randomHeroId)) {
        randomHeroId = Math.floor(heroesList.length * Math.random());
      }
      selectedHeroIds.push(randomHeroId);
    }
    return selectedHeroIds;
  };
  constructor({ round, points, lives, selectedVos, selectedHeroIds }) {
    this.selectedHeroIds = selectedHeroIds;
    this.round = round;
    this.points = points;
    this.lives = lives;
    this.selectedVos = selectedVos;
  }
  static loadGame(state) {
    return new SingleDraft(state);
  }
  static async newGame() {
    const selectedHeroIds = SingleDraft.#selectHeroes();
    const selectedVos = await SingleDraft.#selectVos(selectedHeroIds);
    return new SingleDraft({
      round: 1,
      points: 0,
      lives: 3,
      selectedVos: selectedVos,
      selectedHeroIds: selectedHeroIds,
    });
  }
  async submitAnswer(answer) {
    if (this.lives > 0 && this.selectedVos[0].heroId === answer) {
      this.round++;
      this.points += 25;
    } else {
      this.lives--;
    }
    if (this.lives > 0) {
      this.selectedHeroIds = SingleDraft.#selectHeroes();
      this.selectedVos = await SingleDraft.#selectVos(this.selectedHeroIds);
    }
  }
  requestNewVo() {}
  getPublicState() {
    const publicThis = {};
    for (let index = 0; index < SingleDraft.#publicFields.length; index++) {
      const fieldName = SingleDraft.#publicFields[index];
      publicThis[fieldName] = this[fieldName];
    }
    return publicThis;
  }
};
