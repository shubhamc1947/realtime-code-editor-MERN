// utils/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// Configuration
const DB_CONNECTION_TIMEOUT = 30000; // 30 seconds
const DB_CONNECTION_RETRY_COUNT = 3;

let retryCount = 0;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: DB_CONNECTION_TIMEOUT,
    });
    
    console.log('MongoDB connected successfully');
    
    retryCount = 0;
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      if (retryCount < DB_CONNECTION_RETRY_COUNT) {
        retryCount++;
        setTimeout(connectDB, 5000 * retryCount); // Incremental backoff
      } else {
        console.error('Failed to reconnect to MongoDB after multiple attempts');
        process.exit(1);
      }
    });
    
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    if (retryCount < DB_CONNECTION_RETRY_COUNT) {
      retryCount++;
      console.log(`Retrying connection (${retryCount}/${DB_CONNECTION_RETRY_COUNT}) in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1); 
    }
  }
};

// Graceful shutdown
const closeDBConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully');
    return true;
  } catch (err) {
    console.error('Error while closing MongoDB connection:', err);
    return false;
  }
};

module.exports = {
  connectDB,
  closeDBConnection
};