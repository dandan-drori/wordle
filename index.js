#!/usr/bin/env node

const { ask, close } = require("./services/readline.service.js");
const { INITIAL_LETTERS } = require("./config/constants.js");
const { getRandomWord, printLetters, updateLetters, validateGuess ,printColoredGuessV2, endGame, isTodayDone, printStats, printLastGameGuesses, log } = require("./services/game.service.js");

;(async () => {
  if (isTodayDone()) {
    await printLastGameGuesses();
    printStats();
    close();
    return;
  }
  //if (isInProgress()) {
  //  loadGame();
  //  move declarations of vars above isTodayDone call
  //}
  console.log("Let's play Wordle!");
  let status = 'P';
  let letters = INITIAL_LETTERS;
  const word = getRandomWord();
  const guesses = [];
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
    await log({status, word, guesses});
    if (word === guess) {
      status = 'W';
      await endGame(status, word, guesses);
      break;
    }
    printColoredGuessV2(word, guess);
    letters = updateLetters(letters, guess);
    printLetters(letters);
    console.log(`Remaining guesses: ${6 - guesses.length}\n`);
  }
  if (status !== 'W' && guesses.length >= 6) {
    status = 'L';
    await endGame(status, word, guesses);
  }
  close();
})();
