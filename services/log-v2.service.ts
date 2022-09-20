import { printGuessesStats, getSuccessRate, getWinsAndGuesses, getTodaysDate } from "./util.service";
import { Game } from "../interfaces/game";

export async function getAllGames(col): Promise<Game[]> {
    return await col.find({}).toArray();
}

export async function getTodaysGame(col): Promise<Game> {
    const createdAt = getTodaysDate();
    return await col.findOne({createdAt});
}

export async function logGame(log, col) {
    log.createdAt = getTodaysDate();
    return await col.updateOne({ createdAt: log.createdAt }, { $set: log }, { upsert: true });
}

export async function printStats(col): Promise<void> {
    const games = await getAllGames(col);
    const {wins, guesses} = getWinsAndGuesses(games);
    console.log(`
    Success: ${getSuccessRate(wins, games.length)}
    Wins: ${wins}
    Games: ${games.length}

    Guesses:
${printGuessesStats(guesses)}
`);
}

