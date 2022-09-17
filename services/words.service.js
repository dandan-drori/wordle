const { getWordsCollection } = require("./db.service");
const { ObjectId } = require("mongodb");

async function getAvailableWords() {
    const col = await getWordsCollection();
    return await col.findOne({_id: ObjectId("6325f75b29bbba3145e82339")});
}

module.exports = {
    getAvailableWords,
}
