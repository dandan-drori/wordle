const { getLogsCollection } = require("./db.service");
const { printGuessesStats, getSuccessRate, getWinsAndGuesses, getTodaysDate } = require("./util.service");

async function getAllGames() {
    const col = await getLogsCollection();
    return await col.find({}).toArray();
}

async function getTodaysGame() {
    const col = await getLogsCollection();
    const createdAt = getTodaysDate();
    return await col.findOne({createdAt});
}

async function logGame(log) {
    const col = await getLogsCollection();
    log.createdAt = getTodaysDate();
    return await col.updateOne({ createdAt: log.createdAt }, { $set: log }, { upsert: true });
}

async function printStats() {
    const games = await getAllGames();
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
