/**
 * Formatters — currency, date, file size.
 *
 * Intentionally tiny. No date library, no Intl polyfills beyond browser native.
 */

const dateFmt = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const dateTimeFmt = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const currencyFmtCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFmt(currency: string): Intl.NumberFormat {
  const key = currency;
  let fmt = currencyFmtCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    });
    currencyFmtCache.set(key, fmt);
  }
  return fmt;
}

/** Convert cents → major-unit decimal string. */
export function fromMinorUnits(amount: number): number {
  return amount / 100;
}

/** Convert major-unit decimal → cents (integer). */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/** Format a minor-unit amount as a localised currency string. */
export function formatCurrency(amount: number, currency: string): string {
  return getCurrencyFmt(currency).format(fromMinorUnits(amount));
}

/** Format a date as "12 March 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFmt.format(d);
}

/** Format a date-time as "12 Mar 2026, 4:30 pm". */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateTimeFmt.format(d);
}

/** "Closing in 3 days" / "Closed 5 days ago". */
export function relativeDays(targetIso: string): string {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const abs = Math.abs(days);
  if (days > 0) return days === 1 ? 'Closing tomorrow' : `Closing in ${abs} days`;
  if (days === 0) return 'Closes today';
  return days === -1 ? 'Closed yesterday' : `Closed ${abs} days ago`;
}

/** Convert bytes → "1.4 MB" / "412 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Sanitise a filename for safe display in restricted contexts. */
export function sanitiseFilename(name: string): string {
  return name.replace(/[^\w\s.\-]/g, '_').slice(0, 200);
}