const express = require('express');
const app = express();
require('dotenv').config();

const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/dota-hero-quiz',
      touchAfter: 24 * 3600,
    }),
  })
);
const heroesList = require('./herolist.json');

const generateNewGame = () => {
  return {
    round: 1,
    points: 0,
    lives: 3,
    correctAnswer: Math.floor(heroesList.length * Math.random()),
  };
};
const proceedToNextRound = (state) => {
  const newState = {
    round: state.round + 1,
    points: state.points + 100,
    lives: state.lives,
    correctAnswer: Math.floor(heroesList.length * Math.random()),
  };
  return newState;
};
const isStarted = (req, res, next) => {
  if (req.session.gamestate) {
    next();
  } else {
    res.send({ error: true, message: 'you should start new game' });
  }
};
const fs = require('fs');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
