import Event, { IEvent } from '../models/Event';

/**
 * Service Event - Gère toute la logique métier liée aux événements
 */
export class EventService {
  
  /**
   * Créer un nouvel événement
   */
  async createEvent(data: {
    title: string;
    date: string;
    location: string;
    totalSeats: number;
    price: number;
  }): Promise<IEvent> {
    const event = await Event.create({
      title: data.title,
      date: data.date,
      location: data.location,
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats, // Au départ, toutes les places sont disponibles
      price: data.price,
      status: 'active',
    });

    return event;
  }

  /**
   * Récupérer tous les événements actifs
   */
  async getActiveEvents(): Promise<IEvent[]> {
    return await Event.find({ status: 'active' }).sort({ date: 1 });
  }

  /**
   * Récupérer tous les événements (admin)
   */
  async getAllEvents(): Promise<IEvent[]> {
    return await Event.find().sort({ date: 1 });
  }

  /**
   * Récupérer un événement par ID
   */
  async getEventById(eventId: string): Promise<IEvent | null> {
    return await Event.findById(eventId);
  }

  /**
   * Mettre à jour un événement
   */
  async updateEvent(
    eventId: string,
    data: Partial<{
      title: string;
      date: string;
      location: string;
      price: number;
      status: 'active' | 'cancelled' | 'completed';
    }>
  ): Promise<IEvent | null> {
    const event = await Event.findByIdAndUpdate(
      eventId,
      data,
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new Error('Événement non trouvé');
    }

    return event;
  }

  /**
   * Supprimer un événement
   */
  async deleteEvent(eventId: string): Promise<void> {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      throw new Error('Événement non trouvé');
    }
  }

  /**
   * Réserver des places (décrémente availableSeats)
   */
  async reserveSeats(eventId: string, quantity: number): Promise<IEvent> {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    if (event.status !== 'active') {
      throw new Error('Cet événement n\'est plus disponible');
    }

    if (event.availableSeats < quantity) {
      throw new Error(`Places insuffisantes. Seulement ${event.availableSeats} place(s) disponible(s)`);
    }

    event.availableSeats -= quantity;
    await event.save();

    return event;
  }

  /**
   * Libérer des places (incrémente availableSeats) - Pour annulation
   */
  async releaseSeats(eventId: string, quantity: number): Promise<IEvent> {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    event.availableSeats += quantity;
    await event.save();

    return event;
  }
}

export default new EventService();
