interface Activity {
  id: number;
  eventTitle: string;
  name: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <div className="recent-activity">
      <h3>Activité Récente</h3>
      {activities.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
          Aucune activité récente
        </p>
      ) : (
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              <div>
                <strong>Réservation #{activity.id}</strong> - {activity.eventTitle}
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {activity.name} • {activity.quantity} billet(s) • {activity.totalPrice.toLocaleString('fr-FR')} Ar
              </div>
              <span className="time">{formatTime(activity.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
