const heroesList = require('./herolist.json');
require('dotenv').config();
const fs = require('fs');
let ok = true;
for (let index = 0; index < heroesList.length; index++) {
  const name = heroesList[index].legacyName;
  if (!fs.existsSync(process.env.PATH_TO_VOICE_LINES + '/' + name)) {
    console.log(name);
    ok = false;
  }
}
if (ok) {
  console.log('vo contains all heroList names');
}
