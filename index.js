#!/usr/bin/env node

const { ask, close } = require("./services/readline.service");
const { INITIAL_LETTERS, STATUS_LOGS } = require("./config/constants");
const { getRandomWord, printLetters, updateLetters, validateGuess ,printColoredGuessV2, endGame, printLastGameGuesses } = require("./services/game.service");
const { getTodaysGame, printStats, logGame} = require("./services/log-v2.service");
const { mongoClient } = require("./services/db.service");

;(async () => {
  let status = STATUS_LOGS.PROGRESS;
  let letters = INITIAL_LETTERS;
  let word = getRandomWord();
  let guesses = [];
  const todaysGame = await getTodaysGame();
  if (!!todaysGame && todaysGame.status === STATUS_LOGS.PROGRESS) {
    console.log('Continuing your last game\n');
    guesses = todaysGame.guesses;
    word = todaysGame.word.toLowerCase();
    for (const guess of guesses) {
      const lowerGuess = guess.toLowerCase();
      letters = updateLetters(letters, lowerGuess);
      await printColoredGuessV2(word, lowerGuess);
    }
    printLetters(letters);
  }
  if (!!todaysGame && todaysGame.status !== STATUS_LOGS.PROGRESS) {
    await printLastGameGuesses();
    await printStats();
    close();
    mongoClient.close();
    return;
  }
  await logGame({status, word, guesses});
  console.log("Let's play Wordle!\n");
  while (guesses.length < 6) {
    let guess = await ask('Enter a word: ');
    guess = guess.toLowerCase();
    let isValid = await validateGuess(guess);
    while (!isValid) {
      console.log('Word not recognized! Try another word');
      guess = await ask('Enter a word: ');
      isValid = await validateGuess(guess);
    }
    guesses.push(guess);
    await logGame({status, word, guesses});
    if (word === guess) {
      status = STATUS_LOGS.WIN;
      await endGame(status, word, guesses);
      break;
    }
    for (let i = 0; i < guesses.length; ++i) {
      await printColoredGuessV2(word, guesses[i]);
    }
    letters = updateLetters(letters, guess);
    printLetters(letters);
    console.log(`Remaining guesses: ${6 - guesses.length}\n`);
  }
  if (status !== STATUS_LOGS.WIN && guesses.length >= 6) {
    status = STATUS_LOGS.LOSE;
    await endGame(status, word, guesses);
  }
  close();
  mongoClient.close();
})();
