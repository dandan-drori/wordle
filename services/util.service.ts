import { Game, Guesses } from '../interfaces/game';
import { MongoClient } from 'mongodb';
import { STATUS_LOGS } from '../enums/status-logs';
import { RESET, GREEN_BG } from "../config/colors";
import { INITIAL_GUESSES } from "../config/constants";

export function getTodaysDate(): string {
  const d = new Date();
  const dd = `${d.getDate()}`.padStart(2, '0');
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function getSpaces(num: number): string {
  let spaces = '';
  for (let i = 1; i < num; ++i) {
    spaces += ' ';
  }
  return spaces;
}

export function getSuccessRate(wins: number, games: number): string {
  return `${Math.floor(wins / games * 100)}%`;
}

export function printGuessesStats(guesses: Guesses): string {
  let out = '';
  for (const guess in guesses) {
    out += RESET + '    ' + guess + ' ' + GREEN_BG + getSpaces(guesses[guess as unknown as keyof Guesses]) + (guesses[guess as unknown as keyof Guesses] || '') + RESET + '\n';
  }
  return out;
}

export function getWinsAndGuesses(games: Game[]) {
  let wins = 0;
  const guesses: Guesses = INITIAL_GUESSES;
  games.forEach((game) => {
    if (game.status === STATUS_LOGS.WIN) {
      wins++;
      const guess = game.guesses.length;
      guesses[guess as keyof Guesses] = guesses[guess as keyof Guesses] + 1;
    }
  });
  return {
    wins,
    guesses
  };
}

export function isInProgress(todaysGame: Game): boolean {
  return !!todaysGame && todaysGame.status === STATUS_LOGS.PROGRESS;
}

export function isTodayDone(todaysGame: Game): boolean {
  return !!todaysGame && todaysGame.status !== STATUS_LOGS.PROGRESS;
}

export function progressGreet(): void {
  console.log('Resuming your last game...\n');
}

export async function exit(mongoClient: MongoClient, closeRL: Function): Promise<void> {
  await mongoClient.close();
  closeRL();
}

export function printRemainingGuessesCount(initialGuesses: Guesses, guesses: string[]): void {
  console.log(`Remaining guesses: ${Object.keys(initialGuesses).length - guesses.length}\n`);
}

export function isLose(status: string, guesses: string[], initialGuesses: Guesses): boolean {
  return status !== STATUS_LOGS.WIN && guesses.length >= Object.keys(initialGuesses).length;
}

export function invalidWordWarning(): void {
  console.log('Word not recognized! Try another word.');
}

export function initialGreet(): void {
  console.log("Let's play Wordle!\n");
}
