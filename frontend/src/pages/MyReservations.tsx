import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface Reservation {
  id: number;
  eventId: number;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  totalPrice: number;
  reference: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

const MyReservations = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    setLoading(true);
    try {
      const data = await api.reservations.getMyReservations(token!);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await api.reservations.cancel(reservationId, token!);
      alert('Réservation annulée avec succès');
      fetchMyReservations();
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Chargement de vos réservations...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>
        🎫 Mes Réservations
      </h1>

      {reservations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Vous n'avez pas encore de réservation
        </p>
      ) : (
        <div>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            {reservations.length} réservation(s)
          </p>
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: reservation.status === 'cancelled' ? '#f8d7da' : 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {reservation.eventTitle}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Référence:</strong> {reservation.reference}
                  </p>
                </div>
                <span
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: reservation.status === 'confirmed' ? '#d4edda' : '#f8d7da',
                    color: reservation.status === 'confirmed' ? '#155724' : '#721c24'
                  }}
                >
                  {reservation.status === 'confirmed' ? '✓ Confirmée' : '✗ Annulée'}
                </span>
              </div>

              <div style={{ 
                borderTop: '1px solid #eee', 
                paddingTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Quantité:</strong> {reservation.quantity} billet(s)
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Total payé:</strong> <span style={{ color: '#28a745', fontSize: '1.2em' }}>
                      {reservation.totalPrice.toLocaleString('fr-FR')} Ar
                    </span>
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#999' }}>
                    Réservé le: {formatDate(reservation.createdAt)}
                  </p>
                </div>

                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(reservation.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
