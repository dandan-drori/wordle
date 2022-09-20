import { getWordsCollection } from "./db.service";
import { ObjectId } from "mongodb";

export async function getAvailableWords() Promise<{words: string[]}> {
    const col = await getWordsCollection();
    return await col.findOne({_id: ObjectId("6325f75b29bbba3145e82339")});
}

