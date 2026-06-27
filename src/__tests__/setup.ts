/**
 * Vitest setup — runs before each test file.
 *
 * - Imports jest-dom matchers (toBeInTheDocument, etc.)
 * - Polyfills that jsdom doesn't ship (crypto.randomUUID)
 */

import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure crypto.randomUUID exists in jsdom — Vite/Node usually polyfill this
// but explicit is safer across CI environments.
if (typeof globalThis.crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { webcrypto } = await import('node:crypto');
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

// Clean up the DOM after each test.
afterEach(() => {
  cleanup();
});