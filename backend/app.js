const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
let isConnected = false;
const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  const isVercel = !!process.env.VERCEL;

  try {
    if (DEMO_MODE) {
      // In demo mode, skip DB entirely so serverless works without Mongo
      isConnected = true;
      console.log('Demo mode: skipping database connection');
      return;
    }
    if (uri) {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('MongoDB connected');
    } else {
      // Outside Vercel (local dev) we can still use in-memory server
      if (!isVercel) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoMemory connected');
      } else {
        throw new Error('MONGODB_URI is missing on Vercel and demo mode is off.');
      }
    }
  } catch (err) {
    console.log('MongoDB connection error:', err);
    throw err;
  }
}

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/customers', require('./routes/customers'));

module.exports = { app, connectDB };
