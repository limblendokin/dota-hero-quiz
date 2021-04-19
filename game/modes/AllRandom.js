const heroesList = require('../../herolist.json');
const fs = require('fs');
require('dotenv').config();
module.exports = class AllRandom {
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
    return heroesList.map((hero) => hero.id);
  };
  constructor({ round, points, lives, selectedVos, selectedHeroIds }) {
    this.selectedHeroIds = selectedHeroIds;
    this.round = round;
    this.points = points;
    this.lives = lives;
    this.selectedVos = selectedVos;
  }
  static loadGame(state) {
    return new AllRandom(state);
  }
  static async newGame() {
    const selectedHeroIds = AllRandom.#selectHeroes();
    const selectedVos = await AllRandom.#selectVos(selectedHeroIds);
    return new AllRandom({
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
      this.selectedHeroIds = AllRandom.#selectHeroes();
      this.selectedVos = await AllRandom.#selectVos(this.selectedHeroIds);
    }
  }
  requestNewVo() {}
  getPublicState() {
    const publicThis = {};
    for (let index = 0; index < AllRandom.#publicFields.length; index++) {
      const fieldName = AllRandom.#publicFields[index];
      publicThis[fieldName] = this[fieldName];
    }
    return publicThis;
  }
};
