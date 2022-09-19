const { RESET, GREEN_BG } = require("../config/colors");
const { INITIAL_GUESSES, STATUS_LOGS } = require("../config/constants");

function getTodaysDate() {
  const d = new Date();
  const dd = `${d.getDate()}`.padStart(2, '0');
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function getSpaces(num) {
  let spaces = '';
  for (let i = 1; i < num; ++i) {
    spaces += ' ';
  }
  return spaces;
}

function getSuccessRate(wins, games) {
  return `${Math.floor(wins / games * 100)}%`;
}

function printGuessesStats(guesses) {
  let out = '';
  for (const guess in guesses) {
    out += RESET + '    ' + guess + ' ' + GREEN_BG + getSpaces(guesses[guess]) + (guesses[guess] || '') + RESET + '\n';
  }
  return out;
}

function getWinsAndGuesses(games) {
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

function isInProgress(todaysGame) {
  return !!todaysGame && todaysGame.status === STATUS_LOGS.PROGRESS;
}

function isTodayDone(todaysGame) {
  return !!todaysGame && todaysGame.status !== STATUS_LOGS.PROGRESS;
}

function progressGreet() {
  console.log('Resuming your last game...\n');
}

async function exit(mongoClient, closeRL) {
  await mongoClient.close();
  closeRL();
}

function printRemainingGuessesCount(initialGuesses, guesses) {
  console.log(`Remaining guesses: ${initialGuesses.keys().length - guesses.length}\n`);
}

function isLose(guesses, initialGuesses) {
  return status !== STATUS_LOGS.WIN && guesses.length >= initialGuesses.keys().length;
}

function invalidWordWarning() {
  console.log('Word not recognized! Try another word.');
}

function initialGreet() {
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
