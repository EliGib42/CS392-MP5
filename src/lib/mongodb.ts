import { MongoClient } from 'mongodb';

// Get the MongoDB URI from the .env file
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

// Connect to MongoDB and export the client promise
const clientPromise = client.connect();

export default clientPromise;
