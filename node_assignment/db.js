const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db('social_media');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };
