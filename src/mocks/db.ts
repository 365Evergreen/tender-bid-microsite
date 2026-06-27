/**
 * In-memory database for the MSW mock backend.
 *
 * Persists to localStorage so reloads preserve state during a dev session.
 * Resets to fixtures on first load. This is purely a development aid —
 * production swaps it out for the real API.
 */

import type { Tender, Vendor, Bid, BidDocument } from '@/types';
import { sampleTenders } from './fixtures/tenders';
import { sampleVendors } from './fixtures/vendors';

interface MockDb {
  vendors: Vendor[];
  tenders: Tender[];
  bids: Bid[];
  documents: BidDocument[];
}

const STORAGE_KEY = 'tender-bid:mock-db';

function loadOrSeed(): MockDb {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    /* fall through to seed */
  }
  const seed: MockDb = {
    vendors: structuredClone(sampleVendors),
    tenders: structuredClone(sampleTenders),
    bids: [],
    documents: [],
  };
  return seed;
}

function persist(db: MockDb): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore quota */
  }
}

class MockDatabase {
  private state: MockDb = loadOrSeed();

  reset(): void {
    this.state = {
      vendors: structuredClone(sampleVendors),
      tenders: structuredClone(sampleTenders),
      bids: [],
      documents: [],
    };
    persist(this.state);
  }

  // ---------- Read accessors ----------

  get tenders(): Tender[] {
    return this.state.tenders;
  }

  get vendors(): Vendor[] {
    return this.state.vendors;
  }

  get bids(): Bid[] {
    return this.state.bids;
  }

  get documents(): BidDocument[] {
    return this.state.documents;
  }

  // ---------- Mutations ----------

  addVendor(v: Vendor): void {
    this.state.vendors.push(v);
    persist(this.state);
  }

  findVendorByEmail(email: string): Vendor | undefined {
    return this.state.vendors.find(
      (v) => v.email.toLowerCase() === email.toLowerCase(),
    );
  }

  findVendorById(id: string): Vendor | undefined {
    return this.state.vendors.find((v) => v.id === id);
  }

  addBid(b: Bid): void {
    this.state.bids.push(b);
    persist(this.state);
  }

  updateBid(id: string, patch: Partial<Bid>): Bid | undefined {
    const idx = this.state.bids.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;
    this.state.bids[idx] = { ...this.state.bids[idx], ...patch };
    persist(this.state);
    return this.state.bids[idx];
  }

  findBidById(id: string): Bid | undefined {
    return this.state.bids.find((b) => b.id === id);
  }

  bidsByVendor(vendorId: string): Bid[] {
    return this.state.bids.filter((b) => b.vendorId === vendorId);
  }

  addDocument(doc: BidDocument): void {
    this.state.documents.push(doc);
    persist(this.state);
  }

  documentsByVendor(vendorId: string): BidDocument[] {
    return this.state.documents.filter((d) => d.vendorId === vendorId);
  }
}

export const db = new MockDatabase();
export type { MockDb };