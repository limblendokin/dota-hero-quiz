const heroesList = require('../../herolist.json');
const fs = require('fs');
require('dotenv').config();
module.exports = class AllPick {
  static #publicFields = ['round', 'points', 'lives', 'selectedVos.path'];
  static #selectVos = async () => {
    const vos = [];
    for (let index = 0; index < 5; index++) {
      let randomHeroIndex = Math.floor(heroesList.length * Math.random());
      while (vos.includes(randomHeroIndex)) {
        randomHeroIndex = Math.floor(heroesList.length * Math.random());
      }
      vos.push({ heroId: randomHeroIndex });
    }
    for (let index = 0; index < vos.length; index++) {
      const currentHeroId = vos[index].heroId;
      const availibleVoPaths = await new Promise((resolve, reject) => {
        const currentHeroLegacyName = heroesList.find(
          (hero) => hero.id === currentHeroId
        ).legacyName;
        fs.readdir(
          process.env.PATH_TO_VOICE_LINES + '/' + currentHeroLegacyName,
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
      const randomVoPath =
        process.env.PATH_TO_VOICE_LINES + '/' + randomFileName;
      vos[index].path = randomVoPath;
    }
    return vos;
  };
  static #selectHeroes = (selectedVos) => {
    return [selectedVos[Math.floor(selectedVos.length * Math.random())].heroId];
  };
  constructor({ round, points, lives, selectedVos, selectedHeroIds }) {
    this.selectedHeroIds = selectedHeroIds;
    this.round = round;
    this.points = points;
    this.lives = lives;
    this.selectedVos = selectedVos;
  }
  static loadGame(state) {
    return new AllPick(state);
  }
  static async newGame() {
    const selectedVos = await AllPick.#selectVos();
    const selectedHeroIds = AllPick.#selectHeroes(selectedVos);
    return new AllPick({
      round: 1,
      points: 0,
      lives: 3,
      selectedVos: selectedVos,
      selectedHeroIds: selectedHeroIds,
    });
  }
  async submitAnswer(answer) {
    if (
      this.lives > 0 &&
      this.selectedVos[answer].heroId === this.selectedHeroIds[0]
    ) {
      this.round++;
      this.points += 25;
    } else {
      this.lives--;
    }
    if (this.lives > 0) {
      this.selectedVos = await AllPick.#selectVos();
      this.selectedHeroIds = AllPick.#selectHeroes(this.selectedVos);
    }
  }
  requestNewVo() {}
  getPublicState() {
    const publicThis = {};
    for (let index = 0; index < AllPick.#publicFields.length; index++) {
      const fieldPath = AllPick.#publicFields[index];
      const fieldValue = fieldPath
        .split('.')
        .reduce((previous, current) => previous[current], this);
      const resolvePath = (fieldPath, target) => {
        const obj = {};
        if (fieldPath.length == 0) {
          return target;
        }
        if (Array.isArray(target)) {
          obj[fieldPath[0]] = target.map((el) => resolvePath(fieldPath, el));
        } else {
          obj[fieldPath[0]] = resolvePath(
            fieldPath.slice(1),
            target[fieldPath[0]]
          );
        }
        console.log(obj);
      };
    }
    return publicThis;
  }
};
