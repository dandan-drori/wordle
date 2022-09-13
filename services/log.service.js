const rawLogs = require("../db/logs.json");
const { writeFile } = require("fs").promises;
const { greenBg, reset } = require("../config/colors.js");
const { INITIAL_GUESSES, WIN_LOG, LOSE_LOG, LOG_FILE_PATH } = require("../config/constants.js");

function getKey() {
  const d = new Date();
  const dd = `${d.getDate()}`.padStart(2, '0');
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function isTodayDone() {
  const key = getKey();
  return !!rawLogs[key];
}

async function log(logObj) {
  const key = getKey();
  rawLogs[key] = formatLog(logObj);
  await writeFile(LOG_FILE_PATH, JSON.stringify(rawLogs));
}

function formatLog(log) {
  const w = log.isWin ? WIN_LOG : LOSE_LOG;
  const g = log.guesses.length;
  const word = log.word;
  let guesses = '';
  log.guesses.forEach((guess) => {
    guesses += `-${guess}`;
  });
  return `${w}-${g}-${word}${guesses}`;
}

function printStats() {
  const games = getGames();
  const {wins, guesses} = getWinsAndGuesses();
  console.log(`
    Success: ${getSuccessRate(wins, games)}
    Wins: ${wins}
    Games: ${games}

    Guesses:
${printGuessesStats(guesses)}
`);
}

function getLastGameWord() {
  const lastGame = getLastGame();
  return lastGame.split('-')[2].toUpperCase();
}

function getSuccessRate(wins, games) {
  return `${Math.floor(wins / games * 100)}%`;
}

function getGames() {
  return Object.keys(rawLogs).length;
}

function getWinsAndGuesses() {
  let wins = 0;
  const guesses = INITIAL_GUESSES;
  for (const l in rawLogs) {
    const splitLogs = rawLogs[l].split('-');
    if (splitLogs[0] === WIN_LOG) {
      wins++;
      const guess = splitLogs[1];
      guesses[guess] = guesses[guess] + 1;
    }
  }
  return {wins, guesses};
}

function getLastGameGuesses() {
  const lastGame = getLastGame();
  return lastGame.split('-').slice(3);
}

function getLastGame() {
  const logsKeys = Object.keys(rawLogs);
  const lastLogIndex = Object.keys(rawLogs).length - 1;
  const lastGameKey = logsKeys[lastLogIndex];
  return rawLogs[lastGameKey];
}

function printGuessesStats(guesses) {
  let out = '';
  for (const guess in guesses) {
    out += '    ' + guess + ' ' + greenBg + getSpaces(guesses[guess]) + (guesses[guess] || '') + reset + '\n';
  }
  return out;
}

function getSpaces(num) {
  let spaces = '';
  for (let i = 1; i < num; ++i) {
    spaces += ' ';
  }
  return spaces;
}

module.exports = {
  isTodayDone,
  log,
  printStats,
  getLastGameGuesses,
  getLastGameWord
}
