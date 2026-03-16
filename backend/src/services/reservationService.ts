import Reservation, { IReservation } from '../models/Reservation';
import eventService from './eventService';

/**
 * Génère une référence unique pour la réservation
 */
const generateReference = (): string => {
  return 'REF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

/**
 * Service Reservation - Gère toute la logique métier liée aux réservations
 */
export class ReservationService {
  
  /**
   * Créer une nouvelle réservation
   */
  async createReservation(data: {
    userId: string;
    eventId: string;
    eventTitle: string;
    name: string;
    email: string;
    phone: string;
    quantity: number;
    totalPrice: number;
  }): Promise<IReservation> {
    
    // Réserver les places (vérifie disponibilité)
    await eventService.reserveSeats(data.eventId, data.quantity);

    // Générer une référence unique
    const reference = generateReference();

    // Créer la réservation
    const reservation = await Reservation.create({
      userId: data.userId,
      eventId: data.eventId,
      eventTitle: data.eventTitle,
      name: data.name,
      email: data.email,
      phone: data.phone,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      reference,
      status: 'confirmed',
    });

    return reservation;
  }

  /**
   * Récupérer toutes les réservations d'un utilisateur
   */
  async getUserReservations(userId: string): Promise<IReservation[]> {
    return await Reservation.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Récupérer toutes les réservations (admin)
   */
  async getAllReservations(filters?: {
    eventId?: string;
    email?: string;
    status?: 'confirmed' | 'cancelled';
  }): Promise<IReservation[]> {
    const query: any = {};
    
    if (filters?.eventId) query.eventId = filters.eventId;
    if (filters?.email) query.email = { $regex: filters.email, $options: 'i' };
    if (filters?.status) query.status = filters.status;
    
    return await Reservation.find(query).sort({ createdAt: -1 });
  }

  /**
   * Récupérer une réservation par ID
   */
  async getReservationById(reservationId: string): Promise<IReservation | null> {
    return await Reservation.findById(reservationId);
  }

  /**
   * Annuler une réservation
   */
  async cancelReservation(reservationId: string, userId: string, isAdmin: boolean = false): Promise<IReservation> {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      throw new Error('Réservation non trouvée');
    }

    // Vérifier les permissions
    if (!isAdmin && reservation.userId.toString() !== userId) {
      throw new Error('Accès interdit');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('Cette réservation est déjà annulée');
    }

    // Libérer les places
    await eventService.releaseSeats(reservation.eventId.toString(), reservation.quantity);

    // Marquer comme annulée
    reservation.status = 'cancelled';
    await reservation.save();

    return reservation;
  }

  /**
   * Récupérer les 5 dernières réservations (pour dashboard admin)
   */
  async getRecentReservations(limit: number = 5): Promise<IReservation[]> {
    return await Reservation
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('eventTitle name quantity totalPrice status createdAt');
  }

  /**
   * Calculer les statistiques
   */
  async getStats(): Promise<{
    totalReservations: number;
    totalRevenue: number;
    confirmedReservations: number;
    cancelledReservations: number;
  }> {
    const allReservations = await Reservation.find();
    const confirmedReservations = allReservations.filter(r => r.status === 'confirmed');
    const cancelledReservations = allReservations.filter(r => r.status === 'cancelled');
    
    const totalRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalPrice, 0);

    return {
      totalReservations: allReservations.length,
      totalRevenue,
      confirmedReservations: confirmedReservations.length,
      cancelledReservations: cancelledReservations.length,
    };
  }
}

export default new ReservationService();
