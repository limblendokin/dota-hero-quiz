const fs = require('fs');
require('dotenv').config();
const result = [];
const recursiveFileNames = (path) => {
  const stats = fs.statSync(path);
  if (stats.isDirectory()) {
    let fileNames = fs.readdirSync(path);
    if (fileNames && fileNames.length) {
      fileNames.forEach((element) => {
        recursiveFileNames(path + '/' + element);
      });
    }
  } else {
    const fileName = path.slice(path.lastIndexOf('/'), path.lastIndexOf('.'));
    fileName.split('_').forEach((substr) => {
      if (isNaN(substr)) {
        if (!result.includes(substr)) {
          result.push(substr);
        }
      }
    });
  }
};
recursiveFileNames(process.env.PATH);
fs.writeFileSync('./fileKeys.json', JSON.stringify(result));
