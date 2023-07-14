import { MongoClient, ServerApiVersion } from 'mongodb';
import app from './app.js';

const client = new MongoClient(process.env.MONGO_DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  console.log('Successfully connected to MongoDB');
} catch (err) {
  console.log(err);
}

export const db = client.db('cars');
export const dealerCollection = db.collection('dealers');
export const userCollection = db.collection('users');
export const carsCollection = db.collection('cars');

await userCollection.createIndex(
  {
    email: 1,
  },
  {
    unique: true,
  }
);

const port = 8000;
app.listen(port, '127.0.0.1', () =>
  console.log('Listening to the port', port, 'in', process.env.NODE_ENV)
);

// export default userCollection;
