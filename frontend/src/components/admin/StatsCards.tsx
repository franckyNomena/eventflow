interface Stats {
  totalReservations: number;
  activeEvents: number;
  fillRate: string;
  revenue: number;
  totalUsers: number;
}

interface StatsCardsProps {
  stats: Stats | null;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  if (!stats) {
    return <div>Chargement des statistiques...</div>;
  }

  const statCards = [
    { 
      title: 'Réservations totales', 
      value: stats.totalReservations.toLocaleString('fr-FR'),
      icon: '🎫'
    },
    { 
      title: 'Événements actifs', 
      value: stats.activeEvents.toString(),
      icon: '🎪'
    },
    { 
      title: 'Taux de remplissage', 
      value: stats.fillRate,
      icon: '📊'
    },
    { 
      title: 'Revenus totaux', 
      value: stats.revenue.toLocaleString('fr-FR') + ' Ar',
      icon: '💰'
    },
    { 
      title: 'Utilisateurs inscrits', 
      value: stats.totalUsers.toString(),
      icon: '👥'
    }
  ];

  return (
    <div className="stats-cards">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card">
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>{stat.icon}</div>
          <h3>{stat.title}</h3>
          <div className="value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
