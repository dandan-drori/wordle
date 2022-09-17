const {reset, greenBg} = require("../config/colors.js");
const {INITIAL_GUESSES, STATUS_LOGS} = require("../config/constants.js");

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
    out += reset + '    ' + guess + ' ' + greenBg + getSpaces(guesses[guess]) + (guesses[guess] || '') + reset + '\n';
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

module.exports = {
  getTodaysDate,
  sleep,
  getSuccessRate,
  printGuessesStats,
  getWinsAndGuesses,
}
