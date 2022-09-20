import { getWordsCollection } from "./db.service";
import { Collection, ObjectId } from 'mongodb';

export async function getAvailableWords(): Promise<{words: string[]}> {
    const col: Collection = await getWordsCollection();
    return await col.findOne({_id: new ObjectId("6325f75b29bbba3145e82339")}) as unknown as Promise<{words: string[]}>;
}

