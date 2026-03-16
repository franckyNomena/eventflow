import { useState, useEffect } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import { api } from './api/client'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard.tsx'
import MyReservations from './pages/MyReservations.tsx'
import ReservationForm from './components/Reservation/ReservationForm'
import EventCard from './components/events/EventCard'
import Button from './components/ui/Button'
import AdminEvents from './pages/AdminEvents.tsx'

interface Event {
    id: number
    title: string
    date: string
    location: string
    totalSeats: number
    availableSeats: number
    price: number
}

type ViewType = 'events' | 'reservations' | 'admin' | 'admin-events'
type AuthViewType = 'login' | 'register'

function App() {
    const { isAuthenticated, isAdmin, user, logout, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [currentView, setCurrentView] = useState<ViewType>('events')
    const [authView, setAuthView] = useState<AuthViewType>('login')
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await api.events.getAll();
            setEvents(data);
        } catch (error) {
            console.error("Erreur de chargement des événements:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchEvents()
        }
    }, [isAuthenticated])

    const handleReserveClick = (event: Event) => {
        setSelectedEvent(event);
    }

    const handleReservationComplete = () => {
        setSelectedEvent(undefined);
        fetchEvents();
    }

    // Loading auth
    if (authLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p style={{ color: 'var(--gray-600)' }}>Chargement...</p>
            </div>
        )
    }

    // Not authenticated
    if (!isAuthenticated) {
        if (authView === 'login') {
            return <LoginPage onSwitchToRegister={() => setAuthView('register')} />
        } else {
            return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
        }
    }

    // Loading events
    if (loading) {
        return (
            <div className="App">
                <header className="app-header">
                    <div className="header-content">
                        <div className="header-logo">
                            <h2>🎪 Booking System</h2>
                        </div>
                    </div>
                </header>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--gray-600)' }}>Chargement des événements...</p>
                </div>
            </div>
        )
    }

    // Reservation form
    if (selectedEvent && currentView === 'events') {
        return (
            <div className="App">
                <ReservationForm 
                    event={selectedEvent} 
                    onBack={() => setSelectedEvent(undefined)} 
                    onReservationComplete={handleReservationComplete}
                />
            </div>
        )
    }

    // Main interface
    return (
        <div className="App">
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="header-logo">
                        <h2>🎪 Booking System</h2>
                    </div>
                    <div className="header-user">
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-role">
                                {user?.role === 'admin' ? '👑 Administrateur' : '👤 Utilisateur'}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            style={{ 
                                backgroundColor: 'white', 
                                color: 'var(--primary-600)',
                                border: '2px solid white'
                            }}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="nav-tabs">
                <div className="nav-tabs-content">
                    <button 
                        onClick={() => { setCurrentView('events'); setSelectedEvent(undefined); }} 
                        className={`nav-tab ${currentView === 'events' ? 'active' : ''}`}
                    >
                        🎪 Événements
                    </button>
                    <button 
                        onClick={() => { setCurrentView('reservations'); setSelectedEvent(undefined); }} 
                        className={`nav-tab ${currentView === 'reservations' ? 'active' : ''}`}
                    >
                        🎫 Mes Réservations
                    </button>
                    {isAdmin && (
                        <>
                            <button 
                                onClick={() => { setCurrentView('admin'); setSelectedEvent(undefined); }} 
                                className={`nav-tab ${currentView === 'admin' ? 'active' : ''}`}
                            >
                                📊 Dashboard Admin
                            </button>
                            <button 
                                onClick={() => { setCurrentView('admin-events'); setSelectedEvent(undefined); }} 
                                className={`nav-tab ${currentView === 'admin-events' ? 'active' : ''}`}
                            >
                                🎪 Gérer Événements
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {/* Events View */}
                {currentView === 'events' && (
                    <div className="fade-in">
                        <h1 className="page-title">🎪 Événements Disponibles</h1>
                        
                        <div className="events-grid">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onReserve={() => handleReserveClick(event)}
                                />
                            ))}
                        </div>

                        {events.length === 0 && (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: 'var(--space-16)',
                                color: 'var(--gray-500)'
                            }}>
                                <p style={{ fontSize: 'var(--text-lg)' }}>
                                    Aucun événement disponible pour le moment
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* My Reservations View */}
                {currentView === 'reservations' && <MyReservations />}

                {/* Admin Dashboard View */}
                {currentView === 'admin' && isAdmin && <AdminDashboard />}

                {/* Admin Events Management View */}
                {currentView === 'admin-events' && isAdmin && <AdminEvents />}
            </main>
        </div>
    )
}

export default App
