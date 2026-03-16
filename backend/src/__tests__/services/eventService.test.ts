/**
 * Tests pour EventService
 * 
 * NOTE: Ces tests nécessitent une base de données MongoDB de test
 * Pour exécuter les tests en isolation, utiliser MongoDB Memory Server
 */

import eventService from '../../services/eventService';

describe('EventService', () => {
  
  describe('createEvent', () => {
    it('should create an event with valid data', async () => {
      const eventData = {
        title: 'Concert Test',
        date: '2025-12-31',
        location: 'Antananarivo',
        totalSeats: 100,
        price: 50000,
      };

      const event = await eventService.createEvent(eventData);

      expect(event).toBeDefined();
      expect(event.title).toBe(eventData.title);
      expect(event.availableSeats).toBe(eventData.totalSeats);
      expect(event.status).toBe('active');
    });

    it('should throw error with invalid data', async () => {
      const invalidData = {
        title: '',
        date: '',
        location: '',
        totalSeats: -1,
        price: -100,
      };

      await expect(eventService.createEvent(invalidData)).rejects.toThrow();
    });
  });

  describe('reserveSeats', () => {
    it('should reserve seats when available', async () => {
      // Créer un événement de test
      const event = await eventService.createEvent({
        title: 'Test Event',
        date: '2025-12-31',
        location: 'Test Location',
        totalSeats: 10,
        price: 1000,
      });

      const updatedEvent = await eventService.reserveSeats(event._id.toString(), 3);

      expect(updatedEvent.availableSeats).toBe(7);
    });

    it('should throw error when not enough seats', async () => {
      const event = await eventService.createEvent({
        title: 'Test Event',
        date: '2025-12-31',
        location: 'Test Location',
        totalSeats: 5,
        price: 1000,
      });

      await expect(
        eventService.reserveSeats(event._id.toString(), 10)
      ).rejects.toThrow('Places insuffisantes');
    });
  });

  describe('releaseSeats', () => {
    it('should release seats when cancelling reservation', async () => {
      const event = await eventService.createEvent({
        title: 'Test Event',
        date: '2025-12-31',
        location: 'Test Location',
        totalSeats: 10,
        price: 1000,
      });

      // Réserver d'abord
      await eventService.reserveSeats(event._id.toString(), 3);

      // Puis libérer
      const updatedEvent = await eventService.releaseSeats(event._id.toString(), 3);

      expect(updatedEvent.availableSeats).toBe(10);
    });
  });
});

/**
 * Pour exécuter ces tests:
 * 1. Installer: npm install --save-dev jest ts-jest @types/jest
 * 2. Configurer jest.config.js
 * 3. Lancer: npm test
 */
