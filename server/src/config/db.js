const mongoose = require('mongoose');

const DB_SERVER_URL = process.env.DB_SERVER_URL;

const connectDB =  async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(DB_SERVER_URL);
  console.log('✅ MongoDB connected');
}

module.exports = connectDB ;

