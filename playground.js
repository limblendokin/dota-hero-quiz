// const resolvePath = (fieldPath, target) => {
//   const obj = {};
//   if (fieldPath.length == 0) {
//     return target;
//   }
//   console.log(fieldPath[0]);
//   if (Array.isArray(target[fieldPath[0]])) {
//     obj[fieldPath[0]] = target[fieldPath[0]].map((el) =>
//       resolvePath(fieldPath.slice(1), el)
//     );
//     return obj;
//   } else {
//     const res = resolvePath(fieldPath.slice(1), target[fieldPath[0]]);
//     if (res instanceof Object) {
//       obj[fieldPath[0]] = { ...obj[fieldPath[0]], ...res };
//     } else {
//       obj[fieldPath[0]] = res;
//     }
//     return obj;
//   }
// };
// console.log(
//   resolvePath('selectedVos.path'.split('.'), {
//     selectedHeroIds: [52],
//     round: 1,
//     points: 0,
//     lives: 3,
//     selectedVos: [
//       {
//         heroId: 25,
//         path:
//           'D:/Documents/js-projects/my-projects/dota-hero-quiz/vo/jug_inthebag_03.mp3',
//       },
//       {
//         heroId: 6,
//         path:
//           'D:/Documents/js-projects/my-projects/dota-hero-quiz/vo/ratt_cuz_21.mp3',
//       },
//       {
//         heroId: 28,
//         path:
//           'D:/Documents/js-projects/my-projects/dota-hero-quiz/vo/plance_lose_03.mp3',
//       },
//       {
//         heroId: 113,
//         path:
//           'D:/Documents/js-projects/my-projects/dota-hero-quiz/vo/appa_laugh_05.mp3',
//       },
//       {
//         heroId: 52,
//         path:
//           'D:/Documents/js-projects/my-projects/dota-hero-quiz/vo/furi_kill_14.mp3',
//       },
//     ],
//   })
// );

function randomArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}
console.log(randomArray(22));
console.log(undefined > 1);
