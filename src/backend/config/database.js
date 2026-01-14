const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  Erreur MongoDB: ${error.message}`);
    console.warn('⚠️  Serveur continuera en mode hors ligne');
    console.log('💡 Pour résoudre: Whitelist votre IP sur MongoDB Atlas');
  }
};

module.exports = connectDB;
