import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

interface Event {
    id: number
    title: string
    date: string
    availableSeats: number
    price: number
}

interface ReservationProps {
    event: Event | undefined; 
    onBack: () => void;
    onReservationComplete: () => void;
}

const ReservationForm = ({ event, onBack, onReservationComplete }: ReservationProps) => {
    const { token } = useAuth();
    
    if (!event) {
        console.error("Erreur: L'événement est manquant lors du rendu de ReservationForm.");
        onBack(); 
        return null;
    }

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null); 
        setIsLoading(true);

        try {
            const responseData = await api.reservations.create(event.id, quantity, token!);
            alert('🎉 Réservation et paiement confirmés avec succès ! Référence: ' + responseData.reference);
            onReservationComplete();
        } catch (error: any) {
            setErrorMessage(error.message || "Une erreur est survenue lors de la réservation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '30px auto', 
            padding: '30px', 
            border: '2px solid #007bff', 
            borderRadius: '15px', 
            backgroundColor: 'white',
            boxShadow: '0 8px 20px rgba(0, 123, 255, 0.25)'
        }}>
            <h2 style={{ color: '#007bff', marginBottom: '15px', textAlign: 'center' }}>
                Formulaire de Réservation
            </h2>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Événement: {event.title}</h3>
            <p style={{ marginBottom: '5px' }}>Prix unitaire: <strong style={{ color: '#28a745' }}>{event.price} Ar</strong></p>
            <p style={{ marginBottom: '20px' }}>Places restantes: <strong>{event.availableSeats}</strong></p>
            
            {errorMessage && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    border: '1px solid #f5c6cb', 
                    borderRadius: '5px', 
                    marginBottom: '15px' 
                }}>
                    Erreur: {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '20px' }}>
                    <strong>Quantité de billets *</strong>
                    <input
                        type="number"
                        min="1"
                        max={event.availableSeats} 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        disabled={isLoading}
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            marginTop: '5px', 
                            borderRadius: '6px', 
                            border: '1px solid #007bff', 
                            boxSizing: 'border-box' 
                        }}
                        required
                    />
                </label>
                
                <p style={{ 
                    fontWeight: 'bold', 
                    marginTop: '25px', 
                    fontSize: '1.4em', 
                    textAlign: 'right',
                    color: '#007bff'
                }}>
                    Total à payer : {(quantity * event.price).toLocaleString('fr-FR')} Ar
                </p>

                <div style={{ 
                    marginTop: '30px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    gap: '15px' 
                }}>
                    <button 
                        type="button" 
                        onClick={onBack}
                        disabled={isLoading}
                        style={{ 
                            flex: 1, 
                            padding: '12px 20px', 
                            backgroundColor: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            opacity: isLoading ? 0.6 : 1,
                            fontWeight: 'bold'
                        }}
                    >
                        Annuler / Retour
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading || event.availableSeats < quantity || quantity <= 0}
                        style={{ 
                            flex: 2, 
                            padding: '12px 20px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        {isLoading ? 'Traitement...' : 'Payer et Réserver'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;
