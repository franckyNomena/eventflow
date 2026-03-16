import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/booking-system';
    
    await mongoose.connect(DATABASE_URL);
    
    console.log('✅ MongoDB connecté avec succès');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB déconnecté');
    });
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1); // Arrêter le serveur si la DB ne se connecte pas
  }
};

export default connectDB;
