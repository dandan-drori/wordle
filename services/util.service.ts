import { Game, Guesses } from '../interfaces/game';
const { MongoClient } = require('mongodb');
const { STATUS_LOGS } = require('../enums/status-logs.ts');
const { RESET, GREEN_BG } = require("../config/colors");
const { INITIAL_GUESSES } = require("../config/constants");

function getTodaysDate(): string {
  const d = new Date();
  const dd = `${d.getDate()}`.padStart(2, '0');
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function getSpaces(num: number): string {
  let spaces = '';
  for (let i = 1; i < num; ++i) {
    spaces += ' ';
  }
  return spaces;
}

function getSuccessRate(wins: number, games: number): string {
  return `${Math.floor(wins / games * 100)}%`;
}

function printGuessesStats(guesses: Guesses): string {
  let out = '';
  for (const guess in guesses) {
    out += RESET + '    ' + guess + ' ' + GREEN_BG + getSpaces(guesses[guess]) + (guesses[guess] || '') + RESET + '\n';
  }
  return out;
}

function getWinsAndGuesses(games: Game[]) {
  let wins = 0;
  const guesses = INITIAL_GUESSES;
  games.forEach((game) => {
    if (game.status === STATUS_LOGS.WIN) {
      wins++;
      const guess = game.guesses.length;
      guesses[guess] = guesses[guess] + 1;
    }
  });
  return {
    wins,
    guesses
  };
}

function isInProgress(todaysGame: Game): boolean {
  return !!todaysGame && todaysGame.status === STATUS_LOGS.PROGRESS;
}

function isTodayDone(todaysGame: Game): boolean {
  return !!todaysGame && todaysGame.status !== STATUS_LOGS.PROGRESS;
}

function progressGreet(): void {
  console.log('Resuming your last game...\n');
}

async function exit(mongoClient: typeof MongoClient, closeRL: Function): Promise<void> {
  await mongoClient.close();
  closeRL();
}

function printRemainingGuessesCount(initialGuesses: Guesses, guesses: string[]): void {
  console.log(`Remaining guesses: ${Object.keys(initialGuesses).length - guesses.length}\n`);
}

function isLose(guesses: string[], initialGuesses: Guesses): boolean {
  return status !== STATUS_LOGS.WIN && guesses.length >= Object.keys(initialGuesses).length;
}

function invalidWordWarning(): void {
  console.log('Word not recognized! Try another word.');
}

function initialGreet(): void {
  console.log("Let's play Wordle!\n");
}

module.exports = {
  getTodaysDate,
  sleep,
  getSuccessRate,
  printGuessesStats,
  getWinsAndGuesses,
  isInProgress,
  isTodayDone,
  progressGreet,
  exit,
  printRemainingGuessesCount,
  isLose,
  invalidWordWarning,
  initialGreet,
}
