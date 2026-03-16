import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Event {
  id: number;
  title: string;
  date: string;
  availableSeats: number;
  price: number;
  totalSeats?: number;
  location?: string;
}

interface EventCardProps {
  event: Event;
  onReserve: () => void;
}

const EventCard = ({ event, onReserve }: EventCardProps) => {
  const totalSeats = event.totalSeats || 100;
  const fillPercentage = ((totalSeats - event.availableSeats) / totalSeats) * 100;
  const isAlmostFull = event.availableSeats <= 10 && event.availableSeats > 0;
  const isFull = event.availableSeats === 0;

  // Gradient backgrounds based on event type
  const getGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[event.id % gradients.length];
  };

  return (
    <Card hover padding="none" style={{ overflow: 'hidden', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header avec gradient */}
      <div style={{
        background: getGradient(),
        height: '120px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 'var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3,
        }}></div>
        
        <h3 style={{
          color: 'white',
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 1,
        }}>
          {event.title}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-6)' }}>
        {/* Info Row */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-lg)' }}>📅</span>
            <span style={{ color: 'var(--gray-700)', fontSize: 'var(--text-sm)' }}>
              {new Date(event.date).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {event.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-lg)' }}>📍</span>
              <span style={{ color: 'var(--gray-700)', fontSize: 'var(--text-sm)' }}>
                {event.location}
              </span>
            </div>
          )}
        </div>

        {/* Availability Bar */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2)',
          }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-600)',
              fontWeight: 'var(--font-medium)',
            }}>
              🎫 {event.availableSeats} / {totalSeats} places disponibles
            </span>
            {isAlmostFull && !isFull && (
              <Badge variant="warning" size="sm">Presque complet</Badge>
            )}
            {isFull && (
              <Badge variant="danger" size="sm">Complet</Badge>
            )}
          </div>
          
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--gray-200)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${fillPercentage}%`,
              background: fillPercentage > 80 
                ? 'linear-gradient(90deg, var(--danger-500), var(--danger-600))'
                : fillPercentage > 50
                ? 'linear-gradient(90deg, var(--warning-500), var(--warning-600))'
                : 'linear-gradient(90deg, var(--success-500), var(--success-600))',
              transition: 'width 0.3s ease',
              borderRadius: 'var(--radius-full)',
            }}></div>
          </div>
        </div>

        {/* Price & Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--gray-200)',
        }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--gray-500)',
              marginBottom: 'var(--space-1)',
            }}>
              Prix par billet
            </div>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--primary-600)',
            }}>
              {event.price.toLocaleString('fr-FR')} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-normal)' }}>Ar</span>
            </div>
          </div>

          <Button
            variant={isFull ? 'secondary' : 'primary'}
            size="lg"
            disabled={isFull}
            onClick={onReserve}
          >
            {isFull ? '❌ Complet' : '🎟️ Réserver'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
