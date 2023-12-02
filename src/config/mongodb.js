import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from '~/config/environment';

let pakingDatabaseInstance = null;

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDB = async () => {
  await client.connect();
  pakingDatabaseInstance = client.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!pakingDatabaseInstance) throw new Error('Must connect database!');
  return pakingDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await client.close();
};
