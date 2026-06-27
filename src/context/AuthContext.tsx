/**
 * Auth context — single source of truth for "who is logged in".
 *
 * Initialises from localStorage on mount so refreshes preserve session.
 * Exposes login/register/logout that wrap the service layer and update
 * context state. Consumers use the `useAuth` hook rather than reading
 * the context directly.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  loadPersistedSession,
  login as loginService,
  register as registerService,
  logout as logoutService,
  fetchCurrentVendor,
} from '@/services/auth';
import { setAuthToken } from '@/services/api';
import type { AuthenticatedVendor } from '@/types';

interface AuthContextValue {
  vendor: AuthenticatedVendor | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    company: AuthenticatedVendor['company'];
    contact: AuthenticatedVendor['contact'];
  }) => Promise<AuthenticatedVendor>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<AuthenticatedVendor | null>(null);
  const [status, setStatus] = useState<AuthContextValue['status']>('idle');

  // Initialise from persisted session, then refresh from server.
  useEffect(() => {
    const persisted = loadPersistedSession();
    if (!persisted) {
      setStatus('unauthenticated');
      return;
    }
    setAuthToken(persisted.token);
    setVendor(persisted.vendor);
    setStatus('authenticated');

    // Verify session is still valid in the background.
    fetchCurrentVendor()
      .then((fresh) => {
        setVendor(fresh);
      })
      .catch(() => {
        // Session expired — fall back to unauthenticated.
        setAuthToken(null);
        setVendor(null);
        setStatus('unauthenticated');
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginService({ email, password });
    setVendor(res.vendor);
    setStatus('authenticated');
  }, []);

  const register = useCallback<AuthContextValue['register']>(async (payload) => {
    const res = await registerService(payload);
    setVendor(res.vendor);
    setStatus('authenticated');
    return res.vendor;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setVendor(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ vendor, status, login, register, logout }),
    [vendor, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}