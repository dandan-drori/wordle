const words = require("../db/words.json");
const {grey, white, green, yellow} = require("../config/colors");
const {PRINT_LETTERS_BREAKS} = require("../config/constants");
const {log, printStats, getLastGameGuesses, getLastGameWord, isTodayDone} = require("./log.service");
const {sleep} = require("./util.service");

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

function printColoredGuessV2(word, guess) {
    const w = getLettersMap(word);
    const g = getLettersMap(guess);
    const colors = [];
    for (let i = 0; i < word.length; ++i) {
        const currLetter = guess.charAt(i);
        if (!w[currLetter] && w[currLetter] !== 0) {
            colors.push(grey);
        } else {
            if (currLetter === word.charAt(i)) {
                colors.push(green);
            } else {
                colors.push(yellow);
            }
        }
    }

    let out = '\n ';
    for (let i = 0; i < word.length; ++i) {
        const letter = guess.charAt(i).toUpperCase();
        const color = colors[i];
        out += color + letter + grey;
    }
    console.log(out + white + '\n');
}

function getLettersMap(word) {
    const map = {};
    for (let i = 0; i < word.length; ++i) {
        map[word.charAt(i)] = i;
    }
    return map
}

async function printColoredGuess(word, guess) {
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

    process.stdout.write(' ');
    for (const l of guessList) {
        const letter = l.letter.toUpperCase();
        const color = l.color;
        await sleep(75);
        process.stdout.write(color + letter + grey);
    }
    await sleep(50);
    console.log('');
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

async function printLastGameGuesses() {
    const guessesList = getLastGameGuesses();
    const word = getLastGameWord().toLowerCase();
    for (const guess of guessesList) {
        await sleep(1000);
        await printColoredGuess(word, guess);
    }
}

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
    printLastGameGuesses,
}
