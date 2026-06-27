/**
 * Application entry point.
 *
 * - Mounts MSW (mock backend) in development.
 * - Wraps app in FluentProvider with our editorial theme.
 * - Sets up React Query for server-state caching.
 * - Hands off to React Router for routing.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { FluentProvider } from '@fluentui/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from '@/router';
import { theme, globalStylesheet } from '@/theme';
import { AuthProvider } from '@/context/AuthContext';

import './main.css';

async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

enableMocking().then(() => {
  createRoot(rootEl).render(
    <StrictMode>
      <FluentProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <style>{globalStylesheet}</style>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </FluentProvider>
    </StrictMode>,
  );
});