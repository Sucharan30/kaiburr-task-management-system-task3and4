

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connect() {
  // MongoDB Atlas connection string
  const atlasUri =  'mongodb+srv://task:0ue7NaTS2y9LieeN@atlas001.aetvp.mongodb.net/?retryWrites=true&w=majority&appName=Atlas001'
  try {
    await mongoose.connect(atlasUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB Atlas');
    return;
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
  }

  // Try connecting to local MongoDB at 127.0.0.1
  const localUri = 'mongodb://127.0.0.1:27017/taskmanagement';
  try {
    await mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to local MongoDB at', localUri);
    return;
  } catch (err) {
    console.warn('Failed to connect to local MongoDB:', err.message);
  }

  // Fallback to in-memory MongoDB for development
  console.warn('Falling back to in-memory MongoDB (mongodb-memory-server)');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to in-memory MongoDB');
}

module.exports = { connect };
