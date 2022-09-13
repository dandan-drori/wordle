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

function bandcows(word, guess) {
  const w = {
    0: word[0],
    1: word[1],
    2: word[2],
    3: word[3],
    4: word[4],
  }
  const g = {
    0: guess[0],
    1: guess[1],
    2: guess[2],
    3: guess[3],
    4: guess[4],
  }
}

function printColoredGuessV2(word, guess) {
  const w = getLettersMap(word);
  const g = getLettersMap(guess);
  for (let i = 0; i < word.length; ++i) {
    const currLetter = guess.charAt(i);
    if (!w[currLetter] && w[currLetter] !== 0) {
      console.log('grey');
    } else {
      if (currLetter === word.charAt(i)) {
        console.log('green');
      } else {
        console.log('yellow');
      }
    }
  }
}

function getLettersMap(word) {
  const map = {};
  for (let i = 0; i < word.length; ++i) {
    map[word.charAt(i)] = i;
  }
  return map
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
  printColoredGuessV2,
  validateGuess,
  endGame,
  isTodayDone,
  printStats,
  printLastGameGuesses
}
