import { Collection, MongoClient, ServerApiVersion } from 'mongodb';
require('dotenv').config();

const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
export const mongoClient = new MongoClient(process.env.DB_CONNECTION_STRING as string, mongoClientOptions);

export async function getLogsCollection(): Promise<Collection> {
    return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
            if (err) {
                console.log(`Error connection to database: ${err}`);
                reject(err);
            }
            const collection = mongoClient.db(process.env.DB_NAME as string).collection(process.env.COLLECTION_NAME as string);
            resolve(collection);
        });
    })
}

export async function getWordsCollection(): Promise<Collection> {
    return new Promise((resolve, reject) => {
        mongoClient.connect(err => {
            if (err) {
                console.log(`Error connection to database: ${err}`);
                reject(err);
            }
            const collection = mongoClient.db(process.env.DB_NAME as string).collection(process.env.STATIC_COLLECTION_NAME as string);
            resolve(collection);
        });
    })
}
