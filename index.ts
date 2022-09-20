#!/usr/bin/env ts-node

const { ask, close } = require("./services/readline.service");
const { INITIAL_LETTERS, INITIAL_GUESSES, ASK_INPUT_TEXT } = require("./config/constants");
const { STATUS_LOGS } = require("./enums/status-logs.ts");
const { mongoClient, getLogsCollection } = require("./services/db.service");
const { getRandomWord, printLetters, updateLetters, validateGuess ,printColoredGuessV2, endGame,
  printLastGameGuesses
} = require("./services/game.service");
const { getTodaysGame, printStats, logGame } = require("./services/log-v2.service");
const { isInProgress, isTodayDone, progressGreet, exit, printRemainingGuessesCount, isLose, invalidWordWarning,
  initialGreet
} = require("./services/util.service");

;(async () => {
  let status = STATUS_LOGS.PROGRESS;
  let letters = INITIAL_LETTERS;
  let word = await getRandomWord();
  let guesses = [];
  const logsCol = await getLogsCollection();
  const todaysGame = await getTodaysGame(logsCol);
  if (isInProgress(todaysGame)) {
    progressGreet();
    guesses = todaysGame.guesses;
    if (word.toLowerCase() !== todaysGame.word.toLowerCase()) {
      await logGame({status, word, guesses}, logsCol);
    }
    word = todaysGame.word.toLowerCase();
    for (const guess of guesses) {
      letters = updateLetters(letters, guess.toLowerCase());
      await printColoredGuessV2(word, guess.toLowerCase());
    }
    printLetters(letters);
  }
  if (isTodayDone(todaysGame)) {
    await printLastGameGuesses(todaysGame);
    await printStats(logsCol);
    await exit(mongoClient, close);
    return;
  }
  initialGreet();
  while (guesses.length < Object.keys(INITIAL_GUESSES).length) {
    let guess = await ask(ASK_INPUT_TEXT);
    guess = guess.toLowerCase();
    let isValid = await validateGuess(guess);
    while (!isValid) {
      invalidWordWarning();
      guess = await ask(ASK_INPUT_TEXT);
      isValid = await validateGuess(guess);
    }
    guesses.push(guess);
    await logGame({status, word, guesses}, logsCol);
    if (word === guess) {
      status = STATUS_LOGS.WIN;
      await endGame(status, word, guesses, todaysGame, logsCol);
      break;
    }
    for (let i = 0; i < guesses.length; ++i) {
      await printColoredGuessV2(word, guesses[i]);
    }
    letters = updateLetters(letters, guess);
    printLetters(letters);
    printRemainingGuessesCount(INITIAL_GUESSES, guesses);
  }
  if (isLose(status, guesses, INITIAL_GUESSES)) {
    status = STATUS_LOGS.LOSE;
    await endGame(status, word, guesses, todaysGame, logsCol);
  }
  await exit(mongoClient, close);
})();
