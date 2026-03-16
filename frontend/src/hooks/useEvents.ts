import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

/**
 * Custom Hook pour gérer les événements avec React Query
 * 
 * Avantages :
 * - Cache automatique
 * - Refetch automatique
 * - Loading/Error states gérés
 * - Optimistic updates
 */

// Types
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status?: string;
}

/**
 * Hook pour récupérer tous les événements
 */
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const data = await api.events.getAll();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook pour récupérer un événement par ID
 */
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async () => {
      const data = await api.events.getOne(eventId);
      return data;
    },
    enabled: !!eventId, // Ne lance la requête que si eventId existe
  });
};

/**
 * Hook pour créer un événement (admin)
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'availableSeats'>) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.events.create(eventData, token);
    },
    onSuccess: () => {
      // Invalider le cache pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook pour mettre à jour un événement (admin)
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      eventId, 
      eventData 
    }: { 
      eventId: string; 
      eventData: Partial<Event> 
    }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.events.update(eventId, eventData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook pour supprimer un événement (admin)
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      
      return await api.events.delete(eventId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
