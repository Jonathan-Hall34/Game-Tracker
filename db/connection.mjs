import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

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
    db = client.db("game-tracker"); // name your DB
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
}

export function getDB() {
  return db;
}
