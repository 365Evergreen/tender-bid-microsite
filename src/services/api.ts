/**
 * Fetch wrapper with consistent error envelope handling.
 *
 * All service modules go through this — never call `fetch` directly. The
 * wrapper:
 *   - prefixes the configured base URL
 *   - injects the auth token (if present) from the auth context
 *   - parses JSON responses
 *   - throws `ApiClientError` on non-2xx, with the server's ApiError envelope
 *   - supports streaming upload progress via XHR when `onUploadProgress` is given
 */

import type { ApiErrorResponse } from '@/types';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.error.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = body.error.code;
    this.fieldErrors = body.error.fieldErrors;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** 0-100. Fires repeatedly during upload. */
  onUploadProgress?: (percent: number) => void;
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');

let authToken: string | null = null;
export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Standard JSON request — used for all non-upload endpoints.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined
        ? undefined
        : options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    if (body && body.error) {
      throw new ApiClientError(response.status, body);
    }
    throw new ApiClientError(response.status, {
      error: {
        code: 'unknown_error',
        message: `Request failed with status ${response.status}`,
      },
    });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * Multipart upload via XHR — needed because fetch doesn't expose upload progress.
 */
export function upload<T>(
  path: string,
  formData: FormData,
  options: { onUploadProgress?: (percent: number) => void; signal?: AbortSignal } = {},
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }

    if (options.signal) {
      options.signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && options.onUploadProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        options.onUploadProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as T);
        } catch {
          resolve(xhr.responseText as unknown as T);
        }
      } else {
        try {
          const body = JSON.parse(xhr.responseText) as ApiErrorResponse;
          reject(new ApiClientError(xhr.status, body));
        } catch {
          reject(
            new ApiClientError(xhr.status, {
              error: { code: 'unknown_error', message: `Upload failed (${xhr.status})` },
            }),
          );
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(
        new ApiClientError(0, {
          error: { code: 'network_error', message: 'Network error during upload' },
        }),
      );
    });

    xhr.addEventListener('abort', () => {
      reject(
        new ApiClientError(0, {
          error: { code: 'aborted', message: 'Upload was cancelled' },
        }),
      );
    });

    xhr.send(formData);
  });
}