/**
 * Typed localStorage helpers.
 *
 * Used for persisting bid drafts between sessions so a vendor can come
 * back to an in-progress submission. Keyed by tenderId.
 */

const KEY_PREFIX = 'tender-bid:draft:';

export function readDraft<T>(tenderId: string): T | null {
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + tenderId);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeDraft<T>(tenderId: string, value: T): void {
  try {
    window.localStorage.setItem(KEY_PREFIX + tenderId, JSON.stringify(value));
  } catch {
    /* quota or private mode — silently drop */
  }
}

export function clearDraft(tenderId: string): void {
  try {
    window.localStorage.removeItem(KEY_PREFIX + tenderId);
  } catch {
    /* ignore */
  }
}

export function listDraftKeys(): string[] {
  try {
    const out: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) out.push(k);
    }
    return out;
  } catch {
    return [];
  }
}