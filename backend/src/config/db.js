import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  if (!env.mongoUri) {
    console.error('MONGO_URI is not set. Add it to backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
