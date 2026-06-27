/**
 * Generic API envelope types.
 *
 * The MSW mock backend and the real production backend both return these
 * shapes. Errors are uniform across endpoints.
 */

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Auth-related responses. */
export interface LoginResponse {
  token: string;
  expiresAt: string;
  vendor: import('./user').AuthenticatedVendor;
}

export interface RegisterResponse {
  vendor: import('./user').AuthenticatedVendor;
  /** Whether the vendor must verify email before bidding. */
  requiresVerification: boolean;
}