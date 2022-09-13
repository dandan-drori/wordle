#!/usr/bin/env node

const { ask, close } = require("./services/readline.service.js");
const { INITIAL_LETTERS } = require("./config/constants.js");
const { getRandomWord, printLetters, updateLetters, validateGuess ,printColoredGuessV2, endGame, isTodayDone, printStats, printLastGameGuesses } = require("./services/game.service.js");

;(async () => {
  if (isTodayDone()) {
    await printLastGameGuesses();
    printStats();
    close();
    return;
  }
  console.log("Let's play Wordle!");
  let win = false;
  let letters = INITIAL_LETTERS;
  const word = getRandomWord();
  const guesses = [];
  while (guesses.length < 6) {
    let guess = await ask('Enter a word: ');
    guess = guess.toLowerCase();
    let isValid = await validateGuess(guess);
    while (!isValid) {
      console.log('Invalid input!');
      guess = await ask('Enter a word: ');
      isValid = await validateGuess(guess);
    }
    guesses.push(guess);
    if (word === guess) {
      win = true;
      await endGame(win, word, guesses);
      break;
    }
    printColoredGuessV2(word, guess);
    letters = updateLetters(letters, guess);
    printLetters(letters);
    console.log(`Remaining guesses: ${6 - guesses.length}\n`);
  }
  if (!win && guesses.length >= 6) {
    await endGame(win, word, guesses);
  }
  close();
})();
