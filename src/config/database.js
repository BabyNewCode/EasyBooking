const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URI || 'mongodb+srv://samiamokrane_db_user:mjWJ6YknZwmadx06@easybooking.tq2wnra.mongodb.net/';
    
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connecté avec succès');
    return mongoose.connection;
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
