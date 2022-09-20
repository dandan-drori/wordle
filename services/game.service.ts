import { Game, Letters } from '../interfaces/game';
import { STATUS_LOGS } from '../enums/status-logs';
import { Collection } from 'mongodb';
import { GREY, WHITE, GREEN, YELLOW } from "../config/colors";
import { PRINT_LETTERS_BREAKS } from "../config/constants";
import { sleep } from "./util.service";
import { logGame, printStats } from "./log-v2.service";
import { getAvailableWords } from "./words.service";

export async function getRandomWord(): Promise<string> {
    const { words } = await getAvailableWords();
    const idx = Math.floor(Math.random() * words.length);
    return words[idx];
}

export function printLetters(letters: Letters): void {
    let out = ' ';
    for (const letter in letters) {
        const color = letters[letter as keyof Letters] ? GREY : WHITE;
        const end = PRINT_LETTERS_BREAKS.includes(letter) ? '\n ' : '';
        out += color + letter.toUpperCase() + WHITE + end;
    }
    console.log(out + '\n');
}

export function updateLetters(letters: Letters, guess: string): Letters {
    for (let i = 0; i < guess.length; ++i) {
        const letter = guess.charAt(i);
        letters[letter as keyof Letters] = true;
    }
    return letters;
}

export async function printColoredGuessV2(word: string, guess: string): Promise<void> {
    const wordMap = getLettersMap(word);
    const matchMap: {[key: string]: boolean} = {};
    process.stdout.write(' ');
    for (let i = 0; i < word.length; ++i) {
        const currLetter = guess.charAt(i);
        if (!wordMap[currLetter] && wordMap[currLetter] !== 0) {
            await sleep(50);
            process.stdout.write(GREY + currLetter.toUpperCase());
            continue
        }
        if (currLetter === word.charAt(i)) {
            await sleep(50);
            process.stdout.write(GREEN + currLetter.toUpperCase());
            continue
        }
        const color = matchMap[currLetter] ? GREY : YELLOW;
        await sleep(50);
        process.stdout.write(color + currLetter.toUpperCase());
        matchMap[currLetter] = true;
    }
    console.log(WHITE + '\n');
}

export function getLettersMap(word: string): {[key: string]: number} {
    const map: {[key: string]: number} = {};
    for (let i = 0; i < word.length; ++i) {
        map[word.charAt(i)] = i;
    }
    return map
}

// unused in favor of v2
async function printColoredGuess(word: string, guess: string): Promise<void> {
    const gl = guess.split('');
    const guessList = gl.map((letter) => {
        return {
            letter,
            color: GREY,
        }
    });

    for (let i = 0; i < word.length; ++i) {
        if (word[i] === guess[i]) {
            guessList[i].color = GREEN;
        }

        for (let j = 0; j < guess.length; ++j) {
            if (word[i] === guess[j]) {
                const idx = guessList.findIndex((g) => g.letter === word[i] && g.color !== GREEN);
                if (idx !== -1) {
                    guessList[idx].color = YELLOW;
                }
            }
        }
    }

    process.stdout.write(' ');
    for (const l of guessList) {
        const letter = l.letter.toUpperCase();
        const color = l.color;
        await sleep(50);
        process.stdout.write(color + letter + GREY);
    }
    console.log('');
}

export async function validateGuess(guess: string): Promise<boolean> {
    const { words } = await getAvailableWords();
    return typeof guess === "string" &&
        guess.length === 5 &&
        words.includes(guess);
}

export async function endGame(status: STATUS_LOGS, word: string, guesses: string[], todaysGame: Game, col: Collection): Promise<void> {
    const greet = status === STATUS_LOGS.WIN ? "\nGreat Job!" : "\nGame Over :(";
    console.log(greet);
    await logGame({status, word, guesses}, col);
    await printLastGameGuesses(todaysGame);
    await printStats(col);
}

export async function printLastGameGuesses(todaysGame: Game): Promise<void> {
    const word = todaysGame.word.toLowerCase();
    for (const guess of todaysGame.guesses) {
        await sleep(100);
        await printColoredGuessV2(word, guess);
    }
}
