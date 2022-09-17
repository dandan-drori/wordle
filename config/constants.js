const path = require('path');

const INITIAL_LETTERS = {
  a: false,
  b: false,
  c: false,
  d: false,
  e: false,
  f: false,
  g: false,
  h: false,
  i: false,
  j: false,
  k: false,
  l: false,
  m: false,
  n: false,
  o: false,
  p: false,
  q: false,
  r: false,
  s: false,
  t: false,
  u: false,
  v: false,
  w: false,
  x: false,
  y: false,
  z: false,
};

const INITIAL_GUESSES = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

const STATUS_LOGS = {
  WIN: 'W',
  LOSE: 'L',
  PROGRESS: 'P',
}

const LOG_FILE_PATH = path.join(__dirname, '..', 'db', 'logs.json');

const PRINT_LETTERS_BREAKS = 'ejot';

module.exports = {
  INITIAL_LETTERS,
  INITIAL_GUESSES,
  PRINT_LETTERS_BREAKS,
  STATUS_LOGS,
  LOG_FILE_PATH,
}
