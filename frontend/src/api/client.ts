// Client API centralisé pour toutes les requêtes
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper pour ajouter le token aux headers
const getAuthHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper pour gérer les erreurs
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Une erreur est survenue');
  }
  return response.json();
};

// API Client
export const api = {
  // ============================================
  // AUTHENTIFICATION
  // ============================================
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    },

    register: async (name: string, email: string, password: string, phone: string) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, email, password, phone })
      });
      return handleResponse(response);
    },

    getProfile: async (token: string) => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    }
  },

  // ============================================
  // ÉVÉNEMENTS
  // ============================================
  events: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/events`);
      return handleResponse(response);
    },

    getOne: async (id: number) => {
      const response = await fetch(`${API_URL}/api/events/${id}`);
      return handleResponse(response);
    },

    create: async (data: any, token: string) => {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },

    update: async (id: number, data: any, token: string) => {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },

    delete: async (id: number, token: string) => {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    }
  },

  // ============================================
  // RÉSERVATIONS
  // ============================================
  reservations: { 
    // NOUVELLE méthode pour admin voir TOUTES les réservations
    getAllAdmin: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/reservations/all`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Erreur chargement réservations')
      return response.json()
    },
      
    create: async (eventId: number, quantity: number, token: string) => {
      const response = await fetch(`${API_URL}/api/reserve`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ eventId, quantity })
      });
      return handleResponse(response);
    },

    getMyReservations: async (token: string) => {
      const response = await fetch(`${API_URL}/api/my-reservations`, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    },

    getAll: async (token: string, filters?: { eventId?: number; email?: string; status?: string }) => {
      const params = new URLSearchParams();
      if (filters?.eventId) params.append('eventId', filters.eventId.toString());
      if (filters?.email) params.append('email', filters.email);
      if (filters?.status) params.append('status', filters.status);
      
      const url = `${API_URL}/api/reservations${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    },

    getOne: async (id: number, token: string) => {
      const response = await fetch(`${API_URL}/api/reservations/${id}`, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    },

    cancel: async (id: number, token: string) => {
      const response = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    }
  },

  // ============================================
  // DASHBOARD ADMIN
  // ============================================
  dashboard: {
    getStats: async (token: string) => {
      const response = await fetch(`${API_URL}/api/stats`, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    },

    getActivity: async (token: string) => {
      const response = await fetch(`${API_URL}/api/activity`, {
        headers: getAuthHeaders(token)
      });
      return handleResponse(response);
    }
  },

  // ============================================
  // SANTÉ
  // ============================================
  health: async () => {
    const response = await fetch(`${API_URL}/api/health`);
    return handleResponse(response);
  }
};
