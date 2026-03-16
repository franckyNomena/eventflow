import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

/**
 * Custom Hook pour gérer l'authentification avec React Query
 */

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

/**
 * Hook pour récupérer l'utilisateur connecté
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        return await api.auth.getMe(token);
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook pour l'inscription
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return await api.auth.register(data);
    },
    onSuccess: (data) => {
      // Sauvegarder le token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Mettre à jour le cache user
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
};

/**
 * Hook pour la connexion
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      return await api.auth.login(data);
    },
    onSuccess: (data) => {
      // Sauvegarder le token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Mettre à jour le cache user
      queryClient.setQueryData(['current-user'], data.user);
    },
  });
};

/**
 * Hook pour la déconnexion
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('token');
      return true;
    },
    onSuccess: () => {
      // Vider tout le cache
      queryClient.clear();
    },
  });
};

/**
 * Hook utilitaire pour vérifier si l'utilisateur est admin
 */
export const useIsAdmin = () => {
  const { data: user } = useCurrentUser();
  return user?.role === 'admin';
};

/**
 * Hook utilitaire pour vérifier si l'utilisateur est connecté
 */
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  return { isAuthenticated: !!user, isLoading };
};
