import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

/**
 * Custom Hook pour gérer les réservations avec React Query
 */

// Types
interface Reservation {
  id: string;
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

/**
 * Hook pour récupérer les réservations de l'utilisateur connecté
 */
export const useMyReservations = () => {
  return useQuery({
    queryKey: ['my-reservations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.reservations.getMyReservations(token);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook pour récupérer toutes les réservations (admin)
 */
export const useAllReservations = (filters?: {
  eventId?: string;
  email?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.reservations.getAll(token, filters);
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

/**
 * Hook pour récupérer une réservation par ID
 */
export const useReservation = (reservationId: string) => {
  return useQuery({
    queryKey: ['reservations', reservationId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.reservations.getOne(reservationId, token);
    },
    enabled: !!reservationId,
  });
};

/**
 * Hook pour créer une réservation
 */
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      quantity
    }: {
      eventId: number;
      quantity: number;
    }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.reservations.create(eventId, quantity, token);
    },
    onSuccess: () => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] }); // Pour mettre à jour les places disponibles
    },
  });
};

/**
 * Hook pour annuler une réservation
 */
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.reservations.cancel(reservationId, token);
    },
    onSuccess: () => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['events'] }); // Pour mettre à jour les places disponibles
    },
  });
};
