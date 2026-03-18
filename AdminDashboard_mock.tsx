// AdminDashboard.tsx - Dashboard organisateur avec données mockées
import React, { useState } from 'react';
import { MOCK_EVENTS, MOCK_RESERVATIONS, getMockStats, formatCurrency } from './mockData';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState(getMockStats());
  const [events] = useState(MOCK_EVENTS);
  const [reservations] = useState(MOCK_RESERVATIONS);

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Dashboard Organisateur</h1>
        <p>Bienvenue, Admin EventFlow</p>
      </header>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalReservations}</h3>
            <p>Réservations</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Revenus Totaux</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <h3>{stats.totalSeats}</h3>
            <p>Places Réservées</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">🎪</div>
          <div className="stat-content">
            <h3>{stats.activeEvents}</h3>
            <p>Événements Actifs</p>
          </div>
        </div>
      </div>

      {/* GRAPHIQUE SIMPLE */}
      <div className="chart-section">
        <h2>Réservations cette semaine</h2>
        <div className="simple-chart">
          <div className="chart-bar" style={{ height: '60%' }}>
            <span className="bar-label">Lun<br/>2</span>
          </div>
          <div className="chart-bar" style={{ height: '30%' }}>
            <span className="bar-label">Mar<br/>1</span>
          </div>
          <div className="chart-bar" style={{ height: '90%' }}>
            <span className="bar-label">Mer<br/>3</span>
          </div>
          <div className="chart-bar" style={{ height: '0%' }}>
            <span className="bar-label">Jeu<br/>0</span>
          </div>
          <div className="chart-bar" style={{ height: '60%' }}>
            <span className="bar-label">Ven<br/>2</span>
          </div>
          <div className="chart-bar" style={{ height: '30%' }}>
            <span className="bar-label">Sam<br/>1</span>
          </div>
          <div className="chart-bar" style={{ height: '0%' }}>
            <span className="bar-label">Dim<br/>0</span>
          </div>
        </div>
      </div>

      {/* ÉVÉNEMENTS ACTIFS */}
      <div className="events-section">
        <div className="section-header">
          <h2>Mes Événements</h2>
          <button className="btn-primary">+ Nouvel Événement</button>
        </div>
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Événement</th>
                <th>Date</th>
                <th>Places</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                  <td>{event.availableSeats} / {event.totalSeats}</td>
                  <td>{formatCurrency(event.price)}</td>
                  <td>
                    <span className={`badge badge-${event.status}`}>
                      {event.status === 'active' ? 'Actif' : 'Brouillon'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DERNIÈRES RÉSERVATIONS */}
      <div className="reservations-section">
        <h2>Dernières Réservations</h2>
        <div className="reservations-list">
          {reservations.slice(0, 5).map(reservation => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-header">
                <strong>{reservation.eventTitle}</strong>
                <span className="reservation-ref">{reservation.reference}</span>
              </div>
              <div className="reservation-details">
                <p>👤 {reservation.userName}</p>
                <p>🎫 {reservation.quantity} places</p>
                <p>💰 {formatCurrency(reservation.totalPrice)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
