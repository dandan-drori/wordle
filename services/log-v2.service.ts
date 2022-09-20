import { printGuessesStats, getSuccessRate, getWinsAndGuesses, getTodaysDate } from "./util.service";
import { Game } from "../interfaces/game";
import { Collection } from 'mongodb';

export async function getAllGames(col: Collection): Promise<Game[]> {
    return (await col.find({}).toArray()) as unknown as Game[];
}

export async function getTodaysGame(col: Collection): Promise<Game> {
    const createdAt = getTodaysDate();
    return await col.findOne({createdAt}) as unknown as Game;
}

export async function logGame(log: Game, col: Collection): Promise<any> {
    log.createdAt = getTodaysDate();
    return await col.updateOne({ createdAt: log.createdAt }, { $set: log }, { upsert: true });
}

export async function printStats(col: Collection): Promise<void> {
    const games: Game[] = await getAllGames(col);
    const {wins, guesses} = getWinsAndGuesses(games);
    console.log(`
    Success: ${getSuccessRate(wins, games.length)}
    Wins: ${wins}
    Games: ${games.length}

    Guesses:
${printGuessesStats(guesses)}
`);
}

