import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Configuration du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry automatique en cas d'erreur
      retry: 2,
      // Refetch quand la fenêtre reprend le focus
      refetchOnWindowFocus: true,
      // Refetch quand la connexion est rétablie
      refetchOnReconnect: true,
      // Temps avant que les données soient considérées comme obsolètes
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Temps de cache
      gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
    },
    mutations: {
      // Retry automatique pour les mutations en cas d'erreur réseau
      retry: 1,
    },
  },
});

interface Props {
  children: ReactNode;
}

/**
 * Provider React Query pour toute l'application
 */
export const QueryClientProvider = ({ children }: Props) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};

export { queryClient };
