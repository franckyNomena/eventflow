import { useState, useEffect } from 'react';
import { api } from '../api/client';
import Button from '../components/ui/Button';

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

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    totalSeats: '',
    price: '',
  })

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

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      totalSeats: '',
      price: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      totalSeats: parseInt(formData.totalSeats),
      availableSeats: parseInt(formData.totalSeats),
      price: parseInt(formData.price),
    }

    try {
      if (editingEvent) {
        await api.events.update(editingEvent._id, data)
        alert('Événement modifié avec succès !')
      } else {
        await api.events.create(data)
        alert('Événement créé avec succès !')
      }
      setShowModal(false)
      setEditingEvent(null)
      resetForm()
      fetchEvents()
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
      console.error(error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date.substring(0, 16),
      location: event.location,
      totalSeats: event.totalSeats.toString(),
      price: event.price.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    try {
      await api.events.delete(id)
      alert('Événement supprimé avec succès !')
      fetchEvents()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
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
    <div style={{ padding: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-8)'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
            Gestion des Événements
          </h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Créer, modifier et supprimer des événements
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null)
            resetForm()
            setShowModal(true)
          }}
        >
          ➕ Créer un Événement
        </Button>
      </div>

      {/* Events Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 'var(--space-6)'
      }}>
        {events.map((event) => (
          <div key={event._id} className="card" style={{ overflow: 'hidden' }}>
            {/* Header coloré */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem'
            }}>
              🎪
            </div>

            {/* Content */}
            <div style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'bold', 
                marginBottom: 'var(--space-4)',
                color: 'var(--gray-900)'
              }}>
                {event.title}
              </h3>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--gray-600)'
              }}>
                <div>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</div>
                <div>📍 {event.location}</div>
                <div>💺 {event.availableSeats}/{event.totalSeats} places</div>
                <div style={{ color: 'var(--success-600)', fontWeight: 600 }}>
                  💵 {event.price.toLocaleString('fr-MG')} Ar
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(event)}
                  style={{ flex: 1 }}
                >
                  ✏️ Modifier
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(event._id)}
                  style={{ flex: 1 }}
                >
                  🗑️ Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--space-4)'
        }}>
          <div className="card" style={{ 
            maxWidth: '600px', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: 'var(--space-6)',
              color: 'white'
            }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>
                {editingEvent ? '✏️ Modifier l\'Événement' : '➕ Créer un Événement'}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label className="form-label">Titre de l'événement *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Concert Jazz 2025"
                  />
                </div>

                <div>
                  <label className="form-label">Date et heure *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Lieu *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    placeholder="Grande Salle BICI - Antananarivo"
                  />
                </div>

                <div>
                  <label className="form-label">Nombre de places *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    className="form-input"
                    placeholder="200"
                  />
                </div>

                <div>
                  <label className="form-label">Prix (Ar) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    placeholder="25000"
                  />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingEvent(null)
                      resetForm()
                    }}
                    style={{ flex: 1 }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    style={{ flex: 1 }}
                  >
                    {editingEvent ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEvents
