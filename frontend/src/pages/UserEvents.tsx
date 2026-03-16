import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import './UserEvents.css'

interface Event {
  _id: string
  title: string
  date: string
  location: string
  totalSeats: number
  availableSeats: number
  price: number
  status: string
}

const UserEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await api.events.getAll()
      setEvents(data)
    } catch (error) {
      console.error('Erreur chargement événements:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeEvents = events.filter(e => e.status === 'active')
  const featuredEvent = activeEvents[0]

  const getEventGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ]
    return gradients[index % gradients.length]
  }

  const getAvailabilityStatus = (event: Event) => {
    const percentage = (event.availableSeats / event.totalSeats) * 100
    if (percentage === 0) return { text: 'COMPLET', color: '#ef4444' }
    if (percentage < 20) return { text: 'DERNIÈRES PLACES', color: '#f59e0b' }
    return { text: 'DISPONIBLE', color: '#10b981' }
  }

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`)
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p style={{ color: 'var(--gray-600)' }}>Chargement des événements...</p>
      </div>
    )
  }

  return (
    <div className="user-events-container">
      {/* Hero Section */}
      {featuredEvent && (
        <div className="hero-section" style={{ background: getEventGradient(0) }}>
          <div className="hero-content">
            <div className="hero-badge">⭐ ÉVÉNEMENT À LA UNE</div>
            <h1 className="hero-title">{featuredEvent.title}</h1>
            <div className="hero-info">
              <span>📅 {new Date(featuredEvent.date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span>📍 {featuredEvent.location}</span>
            </div>
            <button 
              className="hero-btn"
              onClick={() => handleEventClick(featuredEvent._id)}
            >
              🎫 Réserver maintenant
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="events-main">
        <div className="events-header">
          <h2 className="section-title">🎪 Événements à venir</h2>
          <p className="section-subtitle">Découvrez tous les événements disponibles</p>
        </div>

        {activeEvents.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">😔</span>
            <h3>Aucun événement disponible</h3>
            <p>Revenez bientôt pour découvrir de nouveaux événements !</p>
          </div>
        ) : (
          <div className="events-grid">
            {activeEvents.map((event, index) => {
              const status = getAvailabilityStatus(event)
              const fillPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100

              return (
                <div 
                  key={event._id} 
                  className="event-card"
                  onClick={() => handleEventClick(event._id)}
                >
                  {/* Event Poster */}
                  <div 
                    className="event-poster"
                    style={{ background: getEventGradient(index) }}
                  >
                    <div className="status-badge" style={{ backgroundColor: status.color }}>
                      {status.text}
                    </div>
                    <div className="poster-content">
                      <span className="poster-icon">🎪</span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    
                    <div className="event-info">
                      <div className="info-row">
                        <span className="info-icon">📅</span>
                        <span className="info-text">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">🕐</span>
                        <span className="info-text">
                          {new Date(event.date).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{event.location}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="availability-section">
                      <div className="availability-text">
                        <span>{event.availableSeats}/{event.totalSeats} places</span>
                        <span className="availability-percentage">{Math.round(fillPercentage)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${fillPercentage}%`,
                            backgroundColor: fillPercentage > 80 ? '#ef4444' : fillPercentage > 50 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="event-footer">
                      <div className="price-section">
                        <span className="price-label">À partir de</span>
                        <span className="price-value">
                          {event.price.toLocaleString('fr-MG')} <span className="currency">Ar</span>
                        </span>
                      </div>
                      <button 
                        className="reserve-btn"
                        disabled={event.availableSeats === 0}
                      >
                        {event.availableSeats === 0 ? '🚫 Complet' : '🎫 Réserver'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserEvents
