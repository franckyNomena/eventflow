import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ─── MODELS ─────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
}, { timestamps: true });

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  reference: { type: String, required: true, unique: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);
const Reservation = mongoose.model('Reservation', ReservationSchema);

// ─── SEED FUNCTION ──────────────────────────────────────────────────────────

async function seedDatabase() {
  try {
    console.log('🌱 Démarrage du seed de démo pour la soutenance...\n');

    // Connexion MongoDB
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log('✅ MongoDB connecté avec succès');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}\n`);

    // ─── NETTOYAGE ───
    console.log('🧹 Nettoyage des anciennes données...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Reservation.deleteMany({});
    console.log('✅ Base nettoyée\n');

    // ─── UTILISATEURS ───
    console.log('👥 Création des utilisateurs...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      name: 'Administrateur BICI',
      email: 'admin@booking.com',
      password: adminPassword,
      role: 'admin',
    });

    const user = await User.create({
      name: 'Client Exemple',
      email: 'user@booking.com',
      password: userPassword,
      role: 'user',
    });

    console.log('✅ 2 utilisateurs créés');
    console.log(`  - Admin: admin@booking.com / admin123`);
    console.log(`  - User: user@booking.com / user123\n`);

    // ─── ÉVÉNEMENTS ───
    console.log('🎪 Création des événements...');

    const event1 = await Event.create({
      title: 'Concert Jazz 2025',
      date: new Date('2025-06-15T19:00:00'),
      location: 'Grande Salle BICI - Antananarivo',
      totalSeats: 200,
      availableSeats: 148, // 52 réservées
      price: 25000,
      status: 'active',
    });

    const event2 = await Event.create({
      title: 'Séminaire Innovation Digitale',
      date: new Date('2025-05-20T09:00:00'),
      location: 'Salle Conférence BICI',
      totalSeats: 100,
      availableSeats: 78, // 22 réservées
      price: 15000,
      status: 'active',
    });

    const event3 = await Event.create({
      title: 'Festival Traditionnel Malagasy',
      date: new Date('2025-07-14T14:00:00'),
      location: 'Esplanade BICI',
      totalSeats: 500,
      availableSeats: 450, // 50 réservées
      price: 10000,
      status: 'active',
    });

    console.log('✅ 3 événements créés');
    console.log(`  - ${event1.title} (${event1.totalSeats - event1.availableSeats}/${event1.totalSeats} places réservées)`);
    console.log(`  - ${event2.title} (${event2.totalSeats - event2.availableSeats}/${event2.totalSeats} places réservées)`);
    console.log(`  - ${event3.title} (${event3.totalSeats - event3.availableSeats}/${event3.totalSeats} places réservées)\n`);

    // ─── RÉSERVATIONS ───
    console.log('🎫 Création des réservations...');

    const reservations = [
      // Concert Jazz (52 places)
      { eventId: event1._id, quantity: 20, name: 'Réservation Groupe A' },
      { eventId: event1._id, quantity: 15, name: 'Réservation VIP' },
      { eventId: event1._id, quantity: 10, name: 'Réservation Entreprise' },
      { eventId: event1._id, quantity: 7, name: 'Réservation Famille' },
      
      // Séminaire (22 places)
      { eventId: event2._id, quantity: 12, name: 'Réservation Partenaire' },
      { eventId: event2._id, quantity: 10, name: 'Réservation Corporate' },
      
      // Festival (50 places)
      { eventId: event3._id, quantity: 25, name: 'Réservation Groupe Étudiant' },
      { eventId: event3._id, quantity: 15, name: 'Réservation Association' },
      { eventId: event3._id, quantity: 10, name: 'Réservation Culturelle' },
    ];

    let totalReservations = 0;
    let totalRevenue = 0;

    for (const res of reservations) {
      const event = await Event.findById(res.eventId);
      if (!event) continue;

      const reservation = await Reservation.create({
        userId: user._id,
        eventId: res.eventId,
        quantity: res.quantity,
        totalPrice: res.quantity * event.price,
        reference: `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'confirmed',
      });

      totalReservations += res.quantity;
      totalRevenue += reservation.totalPrice;
    }

    console.log(`✅ 9 réservations créées`);
    console.log(`  - Total places réservées: ${totalReservations}`);
    console.log(`  - Revenus totaux: ${totalRevenue.toLocaleString('fr-MG')} Ar\n`);

    // ─── STATISTIQUES FINALES ───
    console.log('📊 STATISTIQUES DE DÉMO:\n');
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│  DASHBOARD ADMIN                            │');
    console.log('├─────────────────────────────────────────────┤');
    console.log(`│  Total réservations:    ${totalReservations} places           │`);
    console.log(`│  Revenus générés:       ${(totalRevenue / 1000000).toFixed(1)} M Ar         │`);
    console.log(`│  Événements actifs:     3                   │`);
    console.log(`│  Taux remplissage:      ~20%                │`);
    console.log('└─────────────────────────────────────────────┘\n');

    console.log('🎯 ÉVÉNEMENTS DÉTAILLÉS:\n');
    const events = await Event.find();
    for (const e of events) {
      const reserved = e.totalSeats - e.availableSeats;
      const percent = ((reserved / e.totalSeats) * 100).toFixed(0);
      const revenue = reserved * e.price;
      console.log(`📍 ${e.title}`);
      console.log(`   Places: ${reserved}/${e.totalSeats} (${percent}% rempli)`);
      console.log(`   Revenus: ${revenue.toLocaleString('fr-MG')} Ar`);
      console.log(`   Date: ${e.date.toLocaleDateString('fr-FR')}`);
      console.log('');
    }

    console.log('✅ Seed terminé avec succès !');
    console.log('\n🔐 COMPTES DE TEST:');
    console.log('  Admin: admin@booking.com / admin123');
    console.log('  User: user@booking.com / user123\n');

    await mongoose.disconnect();
    console.log('⚠️  MongoDB déconnecté\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDatabase();
