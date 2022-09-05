const { readFile } = require("fs").promises;
const words = require("./words.json");
const { grey, white, green, yellow } = require("./colors.js");
const { isTodayDone, log, printStats, getLastGameGuesses, getLastGameWord } = require("./log.js");
const { PRINT_LETTERS_BREAKS } = require("./constants.js");

function getRandomWord() {
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

function printLetters(letters) {
  let out = ' ';
  for (const letter in letters) {
    const color = letters[letter] ? grey : white;
    const breaks = PRINT_LETTERS_BREAKS;
    const end = breaks.includes(letter) ? '\n ' : '';
    out += color + letter.toUpperCase() + white + end;
  }
  console.log(out + '\n');
}

function updateLetters(letters, guess) {
  for (let i = 0; i < guess.length; ++i) {
    const letter = guess.charAt(i);
    letters[letter] = true;
  }
  return letters;
}

function printColoredGuess(word, guess) {
  const gl = guess.split('');
  const guessList = gl.map((letter) => {
    return {
      letter,
      color: grey,
    }
  });
  
  for (let i = 0; i < word.length; ++i) {
    if (word[i] === guess[i]) {
      guessList[i].color = green;
    }

    for (let j = 0; j < guess.length; ++j) {
      if (word[i] === guess[j]) {
	const idx = guessList.findIndex((g) => g.letter === word[i] && g.color !== green);
	if (idx !== -1) {
	  guessList[idx].color = yellow;
	}
      }
    }
  }

  let out = '\n ';
  guessList.forEach((letter) => {
    out += letter.color + letter.letter.toUpperCase() + grey;
  });
  console.log(out + white + '\n');
}

async function validateGuess(guess) {
  return typeof guess === "string" &&
		guess.length === 5 &&
		words.includes(guess);
}

async function endGame(win, word, guesses) {
  const greet = win ? "Great Job!" : "Game Over :(";
  console.log(greet);
  console.log("The word was: " + word.toUpperCase());
  await log({isWin: win, guesses, word});
  printStats();
}

function printLastGameGuesses() {
  const guessesList = getLastGameGuesses();
  const word = getLastGameWord().toLowerCase();
  guessesList.map((guess) => {
    printColoredGuess(word, guess);
  })
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function test() {
  console.log('1');
  await sleep(2000);
  console.log('2');
}

test();

module.exports = {
  getRandomWord,
  printLetters,
  updateLetters,
  printColoredGuess,
  validateGuess,
  endGame,
  isTodayDone,
  printStats,
  printLastGameGuesses
}
