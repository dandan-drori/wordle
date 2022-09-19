const words = require("../db/words.json");
const { grey, white, green, yellow } = require("../config/colors");
const { PRINT_LETTERS_BREAKS, STATUS_LOGS } = require("../config/constants");
const { sleep } = require("./util.service");
const { logGame, printStats, getTodaysGame } = require("./log-v2.service");

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

async function printColoredGuessV2(word, guess) {
    const wordMap = getLettersMap(word);
    const matchMap = {};
    process.stdout.write(' ');
    for (let i = 0; i < word.length; ++i) {
        const currLetter = guess.charAt(i);
        if (!wordMap[currLetter] && wordMap[currLetter] !== 0) {
            await sleep(50);
            process.stdout.write(grey + currLetter.toUpperCase());
            continue
        }
        if (currLetter === word.charAt(i)) {
            await sleep(50);
            process.stdout.write(green + currLetter.toUpperCase());
            continue
        }
        const color = matchMap[currLetter] ? grey : yellow;
        await sleep(50);
        process.stdout.write(color + currLetter.toUpperCase());
        matchMap[currLetter] = true;
    }
    console.log(white + '\n');
}

function getLettersMap(word) {
    const map = {};
    for (let i = 0; i < word.length; ++i) {
        map[word.charAt(i)] = i;
    }
    return map
}

// unused in favor of v2
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
        await sleep(50);
        process.stdout.write(color + letter + grey);
    }
    console.log('');
}

async function validateGuess(guess) {
    return typeof guess === "string" &&
        guess.length === 5 &&
        words.includes(guess);
}

async function endGame(status, word, guesses, todaysGame) {
    const greet = status === STATUS_LOGS.WIN ? "\nGreat Job!" : "\nGame Over :(";
    console.log(greet);
    await logGame({status, guesses, word});
    await printLastGameGuesses(todaysGame);
    await printStats();
}

async function printLastGameGuesses(todaysGame) {
    const word = todaysGame.word.toLowerCase();
    for (const guess of todaysGame.guesses) {
        await sleep(1000);
        await printColoredGuessV2(word, guess);
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
    printStats,
    printLastGameGuesses,
}
