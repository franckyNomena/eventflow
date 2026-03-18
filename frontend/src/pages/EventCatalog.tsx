// EventCatalog.tsx - Catalogue des événements (vue participant)
import React, { useState } from 'react';
import { MOCK_EVENTS, formatCurrency, formatDate, type Event } from './mockData';

const EventCatalog: React.FC = () => {
  const [events] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showReservation, setShowReservation] = useState(false);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowReservation(true);
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation réservation
    const reference = `REF-${Date.now()}`;
    alert(`✅ Réservation confirmée !\n\nRéférence: ${reference}\nQuantité: ${quantity} places\nMontant: ${formatCurrency((selectedEvent?.price || 0) * quantity)}`);
    setShowReservation(false);
    setSelectedEvent(null);
    setQuantity(1);
  };

  return (
    <div className="event-catalog">
      {/* HEADER */}
      <header className="catalog-header">
        <div className="header-content">
          <h1>🎫 EventFlow</h1>
          <p>Réservez vos billets en ligne</p>
        </div>
      </header>

      {/* CATALOGUE */}
      <div className="catalog-container">
        <h2>Événements à venir</h2>
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image" style={{ 
                backgroundImage: `url(${event.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="event-category">{event.category}</div>
              </div>
              
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-info">
                  <p className="event-date">
                    📅 {formatDate(event.date)}
                  </p>
                  <p className="event-location">
                    📍 {event.location}
                  </p>
                  <p className="event-description">
                    {event.description}
                  </p>
                </div>
                
                <div className="event-footer">
                  <div className="event-price">
                    <span className="price-amount">{formatCurrency(event.price)}</span>
                    <span className="price-label">par place</span>
                  </div>
                  <div className="event-seats">
                    <span className="seats-available">{event.availableSeats}</span>
                    <span className="seats-label">places disponibles</span>
                  </div>
                </div>
                
                <button 
                  className="btn-reserve"
                  onClick={() => handleSelectEvent(event)}
                >
                  Réserver maintenant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL RÉSERVATION */}
      {showReservation && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowReservation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Réserver vos places</h2>
              <button 
                className="modal-close"
                onClick={() => setShowReservation(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="reservation-event-info">
                <h3>{selectedEvent.title}</h3>
                <p>📅 {formatDate(selectedEvent.date)}</p>
                <p>📍 {selectedEvent.location}</p>
              </div>
              
              <form onSubmit={handleReserve}>
                <div className="form-group">
                  <label>Nombre de places</label>
                  <div className="quantity-selector">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Nom complet</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Rakoto Jean"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="Ex: rakoto@example.com"
                    required
                  />
                </div>
                
                <div className="reservation-total">
                  <span>Total à payer</span>
                  <strong>{formatCurrency(selectedEvent.price * quantity)}</strong>
                </div>
                
                <button type="submit" className="btn-confirm">
                  Confirmer la réservation
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCatalog;
