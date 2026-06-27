/**
 * Smoke test — formatters.
 */

import { describe, it, expect } from 'vitest';

import { formatCurrency, formatFileSize, relativeDays } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats minor-unit cents as a localised currency string', () => {
    // 420000 cents = $4,200.00 AUD
    expect(formatCurrency(420_000, 'AUD')).toContain('4,200');
  });

  it('returns zero for 0 amount', () => {
    expect(formatCurrency(0, 'AUD')).toContain('0');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => expect(formatFileSize(512)).toBe('512 B'));
  it('formats KB', () => expect(formatFileSize(2048)).toBe('2.0 KB'));
  it('formats MB', () => expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB'));
});

describe('relativeDays', () => {
  it('returns "Closes today" for same-day', () => {
    expect(relativeDays(new Date().toISOString())).toBe('Closes today');
  });

  it('returns "Closing tomorrow" for +1 day', () => {
    const t = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(relativeDays(t)).toBe('Closing tomorrow');
  });

  it('returns "Closing in N days" for future', () => {
    const t = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(relativeDays(t)).toBe('Closing in 5 days');
  });

  it('returns "Closed N days ago" for past', () => {
    const t = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(relativeDays(t)).toBe('Closed 3 days ago');
  });
});