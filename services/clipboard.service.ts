import { Squares } from '../enums/squares';
import { exec } from 'child_process';

export async function copyResultToClipboard(word: string, guesses: string[]): Promise<void> {
    let out = `Wordle CLI - ${getDaysSinceFirstGame()} ${guesses.length}/6\n\n`;
    guesses.forEach(guess => {
        out += `${generateColoredGuess(word, guess)}\n`;
    })
    await execPrm(`echo "${out}" | clipboard`);
    console.log('Game result copied to clipboard!');
}

function generateColoredGuess(word: string, guess: string): string {
    let colors = '';
    const wordMap = getLettersMap(word);
    const matchMap: {[key: string]: boolean} = {};
    for (let i = 0; i < word.length; ++i) {
        const currLetter = guess.charAt(i);
        if (!wordMap[currLetter] && wordMap[currLetter] !== 0) {
            colors += Squares.BLACK;
            continue
        }
        if (currLetter === word.charAt(i)) {
            colors += Squares.GREEN;
            continue
        }
        const color = matchMap[currLetter] ? Squares.BLACK : Squares.YELLOW;
        colors += color;
        matchMap[currLetter] = true;
    }
    return colors;
}

function getLettersMap(word: string): {[key: string]: number} {
    const map: {[key: string]: number} = {};
    for (let i = 0; i < word.length; ++i) {
        map[word.charAt(i)] = i;
    }
    return map
}

function getDaysSinceFirstGame(): string {
    const firstGameDate = 1661806800000;
    const convert = {
        s: 1000,
        m: 60,
        h: 60,
        d: 24,
    }
    const {s, m, h, d} = convert;
    return `${Math.floor((Date.now() - firstGameDate) / s / m / h / d)}`;
}

async function execPrm(cmd: string) {
    return new Promise((resolve, reject) => {
        return exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            return resolve(stdout);
        })
    })
}
