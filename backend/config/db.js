const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('You successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB failed:', err.message);
    process.exit(1);
  }
}

// Call this only when your application terminates
/* export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
} */

module.exports = connectToMongoDB;
