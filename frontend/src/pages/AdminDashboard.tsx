import { useState, useEffect } from 'react'
import { api } from '../api/client'

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

interface Reservation {
  _id: string
  userId: {
    name: string
    email: string
  }
  eventId: {
    _id: string
    title: string
  }
  quantity: number
  totalPrice: number
  reference: string
  status: string
  createdAt: string
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [allReservations, setAllReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsData, reservationsData] = await Promise.all([
        api.events.getAll(),
        api.reservations.getAllAdmin() // Cette route doit retourner TOUTES les réservations pour admin
      ])
      setEvents(eventsData)
      setAllReservations(reservationsData)
    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return
    try {
      await api.reservations.cancel(id)
      fetchData() // Recharger
    } catch (error) {
      alert('Erreur lors de l\'annulation')
    }
  }

  // Calculate stats
  const confirmedReservations = allReservations.filter(r => r.status === 'confirmed')
  const totalReservations = confirmedReservations.reduce((sum, r) => sum + r.quantity, 0)
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalPrice, 0)
  const activeEvents = events.filter(e => e.status === 'active').length

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p style={{ color: 'var(--gray-600)' }}>Chargement du dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--space-8)' }}>
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 'var(--space-6)'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginBottom: 'var(--space-2)' }}>
            Total Réservations
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
            {totalReservations}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
            places réservées
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: 'var(--space-6)'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginBottom: 'var(--space-2)' }}>
            Revenus Totaux
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
            {(totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
            Ariary
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: 'var(--space-6)'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginBottom: 'var(--space-2)' }}>
            Événements Actifs
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
            {activeEvents}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
            en cours
          </div>
        </div>

        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          padding: 'var(--space-6)'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginBottom: 'var(--space-2)' }}>
            Taux Remplissage
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
            ~20%
          </div>
          <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
            moyenne globale
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-2xl)' }}>
          📋 Toutes les Réservations ({allReservations.length})
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)', backgroundColor: 'var(--gray-50)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Référence
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Client
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Événement
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Quantité
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Montant
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Statut
                </th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allReservations.slice(0, 20).map((reservation) => (
                <tr key={reservation._id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>
                    {reservation.reference.substring(0, 20)}...
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                    {reservation.userId?.name || 'N/A'}
                    <br />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                      {reservation.userId?.email}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                    {reservation.eventId?.title || 'N/A'}
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                    {reservation.quantity} billet(s)
                  </td>
                  <td style={{ padding: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--success-600)' }}>
                    {reservation.totalPrice.toLocaleString('fr-MG')} Ar
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      backgroundColor: reservation.status === 'confirmed' ? 'var(--success-50)' : 'var(--error-50)',
                      color: reservation.status === 'confirmed' ? 'var(--success-700)' : 'var(--error-700)'
                    }}>
                      {reservation.status === 'confirmed' ? '✓ Confirmé' : '✗ Annulé'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelReservation(reservation._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
