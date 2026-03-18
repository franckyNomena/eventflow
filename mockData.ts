// mockData.ts - Données mockées pour la démonstration EventFlow

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'completed';
  imageUrl?: string;
}

export interface Reservation {
  id: string;
  reference: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// ÉVÉNEMENTS MOCKÉS
export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt_001',
    title: 'Concert Jazz 2025',
    date: '2025-06-15T19:00:00',
    location: 'Palais des Sports, Antananarivo',
    availableSeats: 195,
    totalSeats: 200,
    price: 25000,
    description: 'Soirée jazz exceptionnelle avec artistes internationaux',
    category: 'Concert',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800'
  },
  {
    id: 'evt_002',
    title: 'Séminaire Innovation Digitale',
    date: '2025-07-20T09:00:00',
    location: 'Hôtel Carlton, Antananarivo',
    availableSeats: 85,
    totalSeats: 100,
    price: 15000,
    description: 'Conférence transformation digitale Madagascar',
    category: 'Séminaire',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    id: 'evt_003',
    title: 'Festival Traditionnel Malagasy',
    date: '2025-08-10T14:00:00',
    location: 'Place du 13 Mai, Antananarivo',
    availableSeats: 456,
    totalSeats: 500,
    price: 10000,
    description: 'Célébration culture malgache',
    category: 'Festival',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'
  }
];

// RÉSERVATIONS MOCKÉES
export let MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res_001',
    reference: 'REF-1710789456001',
    eventId: 'evt_001',
    eventTitle: 'Concert Jazz 2025',
    userName: 'Rakoto Jean',
    userEmail: 'rakoto@example.com',
    quantity: 2,
    totalPrice: 50000,
    createdAt: '2025-03-10T14:30:00',
    status: 'confirmed'
  },
  {
    id: 'res_002',
    reference: 'REF-1710789456002',
    eventId: 'evt_002',
    eventTitle: 'Séminaire Innovation',
    userName: 'Rabe Marie',
    userEmail: 'rabe@example.com',
    quantity: 3,
    totalPrice: 45000,
    createdAt: '2025-03-11T09:15:00',
    status: 'confirmed'
  }
];

// STATS DASHBOARD
export const getMockStats = () => ({
  totalReservations: MOCK_RESERVATIONS.length,
  totalRevenue: MOCK_RESERVATIONS.reduce((sum, r) => sum + r.totalPrice, 0),
  totalSeats: MOCK_RESERVATIONS.reduce((sum, r) => sum + r.quantity, 0),
  activeEvents: MOCK_EVENTS.filter(e => e.status === 'active').length
});

// HELPER FUNCTIONS
export const generateReference = (): string => `REF-${Date.now()}`;

export const formatCurrency = (amount: number): string => 
  `${amount.toLocaleString('fr-FR')} Ar`;

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
