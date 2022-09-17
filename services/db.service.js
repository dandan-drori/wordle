const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const mongoClientConfig = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
const client = new MongoClient(process.env.DB_CONNECTION_STRING, mongoClientConfig);

async function getLogsCollection() {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                console.log(`Error connection to database: ${err}`);
                reject(err);
            }
            const collection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME);
            resolve(collection);
        });
    })
}

async function getWordsCollection() {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                console.log(`Error connection to database: ${err}`);
                reject(err);
            }
            const collection = client.db(process.env.DB_NAME).collection(process.env.STATIC_COLLECTION_NAME);
            resolve(collection);
        });
    })
}

module.exports = {
    getLogsCollection,
    getWordsCollection,
}
