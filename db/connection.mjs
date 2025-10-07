import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
//console.log('[DEBUG] MONGO_URI exists:', !!process.env.MONGO_URI, 'len:', process.env.MONGO_URI?.length);

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

export async function connectToDB() {
  try {
    await client.connect();
    db = client.db("game-tracker");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
}

export function getDB() {
  return db;
}
