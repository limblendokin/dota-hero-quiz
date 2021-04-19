
app.get('/heroes', (req, res) => {
  res.send(heroesList);
});
app.post('/newgame', (req, res) => {
  req.session.gamestate = generateNewGame();
  const { correctAnswer, ...response } = req.session.gamestate;
  console.log(correctAnswer);
  res.send(response);
});
app.get('/', isStarted, (req, res) => {
  const { correctAnswer, ...response } = req.session.gamestate;
  console.log(correctAnswer);
  res.send(response);
});
app.post('/', isStarted, (req, res) => {
  let correct = false;
  console.log(req.session);
  if (req.body.answer !== undefined) {
    if (req.body.answer === req.session.gamestate.correctAnswer) {
      req.session.gamestate = proceedToNextRound(req.session.gamestate);
      correct = true;
    } else {
      correct = false;
    }
    const { correctAnswer, ...response } = req.session.gamestate;
    console.log(correctAnswer);
    res.send({ correct: correct, ...response });
  } else {
    res.send({ error: true, message: 'specify answer' });
  }
});
app.get('/line', isStarted, (req, res) => {
  const heroId = req.session.gamestate.correctAnswer;
  const heroName = heroesList.find((el) => el.id === heroId).legacyName;
  const path = `${process.env.PATH_TO_VOICE_LINES}/${heroName}/`;
  fs.readdir(path, (err, files) => {
    if (err) {
      res.send({ err: true });
      console.log(err);
    } else {
      const randomLine = files[Math.floor(Math.random() * files.length)];
      console.log(randomLine);
      res.sendFile(path + randomLine);
    }
  });
});