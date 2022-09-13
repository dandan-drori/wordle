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

const WIN_LOG = 'W';

const LOSE_LOG = 'L';

const LOG_FILE_PATH = '/data/data/com.termux/files/home/node/readline/logs.json';

const PRINT_LETTERS_BREAKS = 'ejot';

module.exports = {
  INITIAL_LETTERS,
  INITIAL_GUESSES,
  PRINT_LETTERS_BREAKS,
  WIN_LOG,
  LOSE_LOG,
  LOG_FILE_PATH,
}
