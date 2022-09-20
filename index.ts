#!/usr/bin/env ts-node

import { ask, closeRL } from "./services/readline.service";
import { INITIAL_LETTERS, INITIAL_GUESSES, ASK_INPUT_TEXT } from "./config/constants";
import { STATUS_LOGS } from "./enums/status-logs";
import { mongoClient, getLogsCollection } from "./services/db.service";
import { getRandomWord, printLetters, updateLetters, validateGuess ,printColoredGuessV2, endGame,
  printLastGameGuesses
} from "./services/game.service";
import { getTodaysGame, printStats, logGame } from "./services/log-v2.service";
import { isInProgress, isTodayDone, progressGreet, exit, printRemainingGuessesCount, isLose, invalidWordWarning,
  initialGreet
} from "./services/util.service";
import { Game, Letters } from './interfaces/game';
import { Collection } from 'mongodb';

;(async () => {
  let status: STATUS_LOGS = STATUS_LOGS.PROGRESS;
  let letters: Letters = INITIAL_LETTERS;
  let word: string = await getRandomWord();
  let guesses: string[] = [];
  const logsCol: Collection = await getLogsCollection();
  const todaysGame: Game = await getTodaysGame(logsCol);
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
    await exit(mongoClient, closeRL);
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
  await exit(mongoClient, closeRL);
})();
