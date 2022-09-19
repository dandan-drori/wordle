import { Guesses, Letters } from '../interfaces/game';

const path = require('path');

export const INITIAL_LETTERS: Letters = {
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

export const INITIAL_GUESSES: Guesses = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

export const LOG_FILE_PATH = path.join(__dirname, '..', 'db', 'logs.json');

export const PRINT_LETTERS_BREAKS = 'ejot';

export const ASK_INPUT_TEXT = 'Enter a word: ';
