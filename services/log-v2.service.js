const { getLogsCollection } = require("./db.service");
const { printGuessesStats, getSuccessRate, getWinsAndGuesses, getTodaysDate } = require("./util.service");

async function getAllGames(col) {
    return await col.find({}).toArray();
}

async function getTodaysGame(col) {
    const createdAt = getTodaysDate();
    return await col.findOne({createdAt});
}

async function logGame(log, col) {
    log.createdAt = getTodaysDate();
    return await col.updateOne({ createdAt: log.createdAt }, { $set: log }, { upsert: true });
}

async function printStats(col) {
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

module.exports = {
    printStats,
    getTodaysGame,
    logGame,
}
