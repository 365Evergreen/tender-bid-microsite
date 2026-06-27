/**
 * Router config — all routes for the microsite.
 *
 * Uses React Router v6 data router. Route guards:
 *   - <RequireAuth> wraps any route that needs the vendor to be signed in.
 *
 * Lazy loading via `React.lazy` so each page's JS only loads when the
 * user actually navigates to it. The shell + theme load immediately.
 */

import { Suspense, lazy, type ReactNode } from 'react';
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { Loading } from '@/components/common/Loading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const TenderListPage = lazy(() =>
  import('@/pages/TenderListPage').then((m) => ({ default: m.TenderListPage })),
);
const TenderDetailPage = lazy(() =>
  import('@/pages/TenderDetailPage').then((m) => ({ default: m.TenderDetailPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const BidFormPage = lazy(() =>
  import('@/pages/BidFormPage').then((m) => ({ default: m.BidFormPage })),
);
const ConfirmationPage = lazy(() =>
  import('@/pages/ConfirmationPage').then((m) => ({ default: m.ConfirmationPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function LazyFallback() {
  return (
    <Suspense fallback={<Loading label="Loading page…" />}>
      <Outlet />
    </Suspense>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading' || status === 'idle') {
    return <Loading label="Checking session…" />;
  }
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorBoundary><AppShell /></ErrorBoundary>,
    children: [
      {
        element: <LazyFallback />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'tenders', element: <TenderListPage /> },
          { path: 'tenders/:id', element: <TenderDetailPage /> },
          {
            path: 'tenders/:id/bid',
            element: (
              <RequireAuth>
                <BidFormPage />
              </RequireAuth>
            ),
          },
          { path: 'tenders/:id/bid/confirmation/:bidId', element: <ConfirmationPage /> },
          {
            path: 'register',
            element: (
              <PublicOnly>
                <RegisterPage />
              </PublicOnly>
            ),
          },
          {
            path: 'login',
            element: (
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            ),
          },
          {
            path: 'dashboard',
            element: (
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}