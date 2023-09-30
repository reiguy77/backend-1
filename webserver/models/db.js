const mongoose = require("mongoose");

const dbConfig = require("../config/db.config.js");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URL || dbConfig.url;
// const client = new MongoClient(uri);
// Set up the connection options (if needed)
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

db.mongoose
  .connect(db.url, connectionOptions)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

db.mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to the database.');
});

db.mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

db.mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});


db.closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

// Export the mongoose object, so you can use it to define your models in separate files
module.exports = db;

