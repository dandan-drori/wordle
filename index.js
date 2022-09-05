#!/usr/bin/env node

const { ask, close } = require("./rl.js");
const { INITIAL_LETTERS } = require("./constants.js");
const { getRandomWord, printLetters, updateLetters, validateGuess, printColoredGuess, endGame, isTodayDone, printStats, printLastGameGuesses } = require("./helpers.js");


;(async () => {
  if (isTodayDone()) {
    console.log('You already found todays word!');
    printStats();
    printLastGameGuesses();
    close();
    return;
  }
  console.log("Let's play wordle!");
  let win = false;
  let letters = INITIAL_LETTERS;
  const word = getRandomWord();
  const guesses = [];
  while (guesses.length < 6) {
    let guess = await ask("Enter a word: ");
    guess = guess.toLowerCase();
    let isValid = await validateGuess(guess);
    while (!isValid) {
      console.log("Invalid input!");
      guess = await ask("Enter a word: ");
      isValid = await validateGuess(guess);
    }
    guesses.push(guess);
    if (word === guess) {
      win = true;
      await endGame(win, word, guesses);
      break;
    }
    printColoredGuess(word, guess);
    letters = updateLetters(letters, guess);
    printLetters(letters);
    console.log('Remaining guesses: ' + (6 - guesses.length) + '\n');
  }
  if (!win && guesses.length >= 6) {
    await endGame(win, word, guesses);
  }
  close();
})();
