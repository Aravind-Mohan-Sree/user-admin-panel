const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONG0DB_CONNECTION_STRING);
    console.log('MongoDB connected');  
  } catch (err) {
    console.log(`Error connecting MongoDB. ${err}`);
  }
}

module.exports = connectMongoDB; 