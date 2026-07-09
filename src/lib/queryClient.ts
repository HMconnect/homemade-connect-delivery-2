import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 30,         // 30 minutes  
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Cache keys
export const CACHE_KEYS = {
  vendors: (state: string, city: string) => ['vendors', state, city],
  products: (vendorId: string) => ['products', vendorId],
  sampleVendors: () => ['sample-vendors'],
  stripeStatus: (userId: string) => ['stripe-status', userId],
  userProfile: (userId: string) => ['user-profile', userId],
  orders: (userId: string) => ['orders', userId],
} as const;
