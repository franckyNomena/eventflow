import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';
import User, { IUser } from './models/User';
import Event from './models/Event';
import Reservation from './models/Reservation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ============================================
// CONNEXION MONGODB
// ============================================

connectDB();

// ============================================
// SÉCURITÉ & MIDDLEWARE
// ============================================

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// INTERFACES
// ============================================

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

// ============================================
// UTILITAIRES
// ============================================

const generateReference = (): string => {
  return 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// ============================================
// MIDDLEWARE D'AUTHENTIFICATION
// ============================================

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit : droits administrateur requis' });
  }
  next();
};

// ============================================
// ROUTES - AUTHENTIFICATION
// ============================================

// POST - Inscription
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
    });
    
    const token = generateToken(newUser);
    
    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST - Connexion
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = generateToken(user);
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Profil utilisateur
app.get('/api/auth/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Continuer dans la partie 2...

// ============================================
// ROUTES - ÉVÉNEMENTS
// ============================================

app.use('/api', apiLimiter);

// GET - Liste tous les événements (PUBLIC)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({ status: 'active' }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Erreur liste événements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Un événement par ID (PUBLIC)
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Erreur événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST - Créer un événement (ADMIN)
app.post('/api/events', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, date, location, totalSeats, price } = req.body;
    
    if (!title || !date || !location || !totalSeats || !price) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const newEvent = await Event.create({
      title,
      date,
      location,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      price: parseInt(price),
      status: 'active',
    });
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erreur création événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT - Modifier un événement (ADMIN)
app.put('/api/events/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, date, location, price, status } = req.body;
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, location, price, status },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Erreur modification événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE - Supprimer un événement (ADMIN)
app.delete('/api/events/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================
// ROUTES - RÉSERVATIONS
// ============================================

// POST - Créer une réservation
app.post('/api/reserve', authenticate, async (req: AuthRequest, res) => {
  try {
    const { eventId, quantity } = req.body;
    
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (!eventId || !quantity) {
      return res.status(400).json({ message: 'eventId et quantity sont requis' });
    }
    
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    if (event.status !== 'active') {
      return res.status(400).json({ message: 'Cet événement n\'est plus disponible' });
    }
    
    if (event.availableSeats < parsedQuantity) {
      return res.status(400).json({ 
        message: `Places insuffisantes. Seulement ${event.availableSeats} place(s) disponible(s)` 
      });
    }
    
    const reference = generateReference();
    const totalPrice = event.price * parsedQuantity;
    
    const newReservation = await Reservation.create({
      userId: user._id,
      eventId: event._id,
      eventTitle: event.title,
      name: user.name,
      email: user.email,
      phone: user.phone,
      quantity: parsedQuantity,
      totalPrice,
      reference,
      status: 'confirmed',
    });
    
    // Mettre à jour les places disponibles
    event.availableSeats -= parsedQuantity;
    await event.save();
    
    res.status(201).json({
      message: 'Réservation et paiement confirmés !',
      reference,
      reservation: newReservation
    });
  } catch (error) {
    console.error('Erreur réservation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Mes réservations
app.get('/api/my-reservations', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Erreur mes réservations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Toutes les réservations (ADMIN)
app.get('/api/reservations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { eventId, email, status } = req.query;
    
    const filter: any = {};
    if (eventId) filter.eventId = eventId;
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (status) filter.status = status;
    
    const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Erreur liste réservations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Une réservation
app.get('/api/reservations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    if (reservation.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit' });
    }
    
    res.json(reservation);
  } catch (error) {
    console.error('Erreur réservation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE - Annuler une réservation
app.delete('/api/reservations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    
    if (reservation.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit' });
    }
    
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Cette réservation est déjà annulée' });
    }
    
    const event = await Event.findById(reservation.eventId);
    if (event) {
      event.availableSeats += reservation.quantity;
      await event.save();
    }
    
    reservation.status = 'cancelled';
    await reservation.save();
    
    res.json({ 
      message: 'Réservation annulée avec succès',
      reservation
    });
  } catch (error) {
    console.error('Erreur annulation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================
// ROUTES - DASHBOARD / STATISTIQUES
// ============================================

// GET - Statistiques
app.get('/api/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const activeEvents = await Event.countDocuments({ status: 'active' });
    
    const events = await Event.find();
    const totalSeats = events.reduce((sum, e) => sum + e.totalSeats, 0);
    const bookedSeats = events.reduce((sum, e) => sum + (e.totalSeats - e.availableSeats), 0);
    const fillRate = totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(1) : '0';
    
    const reservations = await Reservation.find({ status: 'confirmed' });
    const revenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
    
    const totalUsers = await User.countDocuments();
    
    res.json({
      totalReservations,
      activeEvents,
      fillRate: `${fillRate}%`,
      revenue,
      totalUsers
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET - Activité récente
app.get('/api/activity', authenticate, requireAdmin, async (req, res) => {
  try {
    const recentReservations = await Reservation
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('eventTitle name quantity totalPrice status createdAt');
    
    res.json(recentReservations);
  } catch (error) {
    console.error('Erreur activité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    const eventsCount = await Event.countDocuments();
    const reservationsCount = await Reservation.countDocuments();
    const usersCount = await User.countDocuments();
    
    res.json({ 
      message: '🚀 API Booking System en marche !', 
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'MongoDB',
      stats: {
        events: eventsCount,
        reservations: reservationsCount,
        users: usersCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', database: 'disconnected' });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log(`✅ Serveur backend sur http://localhost:${PORT}`);
  console.log(`🔐 Comptes de test:`);
  console.log(`   Admin: admin@booking.com / admin123`);
  console.log(`   User:  user@booking.com / user123`);
  console.log(`\n💡 Pour initialiser la base de données:`);
  console.log(`   npm run seed`);
});

