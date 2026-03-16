import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Event from '../models/Event';
import Reservation from '../models/Reservation';

dotenv.config();

const seedDatabase = async () => {
  try {
    const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/booking-system';
    await mongoose.connect(DATABASE_URL);
    
    console.log('🌱 Démarrage du seed de la base de données...');
    
    // Nettoyer la base de données
    await User.deleteMany({});
    await Event.deleteMany({});
    await Reservation.deleteMany({});
    console.log('🧹 Base de données nettoyée');
    
    // Créer les utilisateurs
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    const admin = await User.create({
      name: 'Admin Principal',
      email: 'admin@booking.com',
      password: adminPassword,
      phone: '034 00 000 00',
      role: 'admin',
    });
    
    const user = await User.create({
      name: 'User Test',
      email: 'user@booking.com',
      password: userPassword,
      phone: '034 11 111 11',
      role: 'user',
    });
    
    console.log('👥 Utilisateurs créés:', admin.email, user.email);
    
    // Créer les événements
    const events = await Event.insertMany([
      {
        title: 'Concert Rock - Les Légendes',
        date: '2026-06-15',
        location: 'Stade Municipal',
        totalSeats: 100,
        availableSeats: 100,
        price: 50000,
        status: 'active',
      },
      {
        title: 'Conférence Tech & Innovation',
        date: '2026-07-20',
        location: 'Centre de Conférences',
        totalSeats: 50,
        availableSeats: 50,
        price: 75000,
        status: 'active',
      },
      {
        title: 'Festival Gastronomique',
        date: '2026-08-10',
        location: 'Parc Central',
        totalSeats: 200,
        availableSeats: 200,
        price: 30000,
        status: 'active',
      },
      {
        title: 'Soirée Jazz Premium',
        date: '2026-09-05',
        location: 'Club Le Blue Note',
        totalSeats: 80,
        availableSeats: 80,
        price: 100000,
        status: 'active',
      },
    ]);
    
    console.log('🎪 Événements créés:', events.length);
    
    console.log('✅ Seed terminé avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - ${await User.countDocuments()} utilisateurs`);
    console.log(`   - ${await Event.countDocuments()} événements`);
    console.log(`   - ${await Reservation.countDocuments()} réservations`);
    console.log('\n🔐 Comptes de test:');
    console.log('   Admin: admin@booking.com / admin123');
    console.log('   User:  user@booking.com / user123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedDatabase();
