/**
 * Auth service — register, login, logout, fetch current vendor.
 *
 * The mock backend persists a session in localStorage so reloads don't log
 * the user out. The real backend would persist via httpOnly cookie + CSRF.
 */

import { request, setAuthToken } from './api';
import type {
  AuthenticatedVendor,
  LoginResponse,
  RegisterResponse,
  VendorCompany,
  VendorContact,
} from '@/types';

const SESSION_KEY = 'tender-bid:session';

interface PersistedSession {
  token: string;
  expiresAt: string;
  vendor: AuthenticatedVendor;
}

export function loadPersistedSession(): PersistedSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSession;
    if (new Date(parsed.expiresAt).getTime() < Date.now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(session: PersistedSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearPersistedSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export interface RegisterPayload {
  email: string;
  password: string;
  company: VendorCompany;
  contact: VendorContact;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
  return res;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
  setAuthToken(res.token);
  persistSession({
    token: res.token,
    expiresAt: res.expiresAt,
    vendor: res.vendor,
  });
  return res;
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/auth/logout', { method: 'POST' });
  } catch {
    /* logout is best-effort — local cleanup proceeds regardless */
  }
  setAuthToken(null);
  clearPersistedSession();
}

export async function fetchCurrentVendor(): Promise<AuthenticatedVendor> {
  return request<AuthenticatedVendor>('/auth/me');
}