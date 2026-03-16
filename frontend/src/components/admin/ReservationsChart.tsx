import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReservationsChart = () => {
  // Données exemple - en production, ces données viendraient de l'API
  const data = [
    { month: 'Jan', reservations: 45, revenue: 2250000 },
    { month: 'Fév', reservations: 52, revenue: 2600000 },
    { month: 'Mar', reservations: 38, revenue: 1900000 },
    { month: 'Avr', reservations: 61, revenue: 3050000 },
    { month: 'Mai', reservations: 55, revenue: 2750000 },
    { month: 'Juin', reservations: 70, revenue: 3500000 },
  ];

  return (
    <div className="chart-section">
      <h3 style={{ marginBottom: 'var(--space-6)', color: 'var(--gray-800)' }}>
        📈 Réservations & Revenus Mensuels
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'var(--gray-600)' }}
            axisLine={{ stroke: 'var(--gray-300)' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: 'var(--gray-600)' }}
            axisLine={{ stroke: 'var(--gray-300)' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fill: 'var(--gray-600)' }}
            axisLine={{ stroke: 'var(--gray-300)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'revenue') {
                return [value.toLocaleString('fr-FR') + ' Ar', 'Revenus'];
              }
              return [value, 'Réservations'];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              if (value === 'reservations') return 'Réservations';
              if (value === 'revenue') return 'Revenus (Ar)';
              return value;
            }}
          />
          <Bar 
            yAxisId="left"
            dataKey="reservations" 
            fill="var(--primary-600)" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            yAxisId="right"
            dataKey="revenue" 
            fill="var(--success-500)" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: 'var(--space-6)',
        padding: 'var(--space-4)',
        backgroundColor: 'var(--primary-50)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        color: 'var(--primary-700)',
      }}>
        💡 <strong>Tendance :</strong> Les réservations sont en hausse ce mois-ci ! Continuez sur cette lancée.
      </div>
    </div>
  );
};

export default ReservationsChart;
