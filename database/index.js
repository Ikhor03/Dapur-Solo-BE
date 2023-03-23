const mongoose = require('mongoose')
const { dbHost, dbName, dbPass, dbPort, dbUser } = require('../app/config')


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

module.exports = connectDB