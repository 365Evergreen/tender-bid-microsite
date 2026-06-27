/**
 * useBidDraft — manage an in-progress bid for a specific tender.
 *
 * Persists to localStorage on every change so a vendor can refresh,
 * switch tabs, or close the laptop and come back. Cleared on successful
 * submit or explicit reset.
 *
 * The hook is the single source of truth for the multi-step form. Each
 * step reads/writes its slice via the returned setters.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { BidDraft } from '@/types';
import { readDraft, writeDraft, clearDraft } from '@/utils/localStorage';

const EMPTY_DRAFT: Omit<BidDraft, 'tenderId'> = {
  company: {
    legalName: '',
    tradingName: '',
    registrationNumber: '',
    taxId: '',
    registeredAddress: {
      line1: '',
      line2: '',
      city: '',
      region: '',
      postcode: '',
      country: '',
    },
    industry: '',
    yearsTrading: undefined,
    employeeCount: undefined,
  },
  contact: {
    fullName: '',
    role: '',
    email: '',
    phone: '',
  },
  pricing: {
    currency: 'AUD',
    lineItems: [
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: { amount: 0, currency: 'AUD' },
      },
    ],
    subtotal: 0,
    taxRate: 0.1,
    taxAmount: 0,
    total: 0,
  },
  compliance: {
    conflictOfInterestDeclared: false,
    conflictOfInterestDetails: '',
    acceptsTermsAndConditions: false,
    acceptsCodeOfConduct: false,
    insuranceVerified: false,
    insuranceExpiryDate: '',
  },
  proposal: '',
  currentStep: 1,
  updatedAt: new Date().toISOString(),
};

function makeEmptyDraft(tenderId: string): BidDraft {
  return { ...EMPTY_DRAFT, tenderId };
}

function recomputePricing(draft: BidDraft): BidDraft {
  const subtotal = draft.pricing.lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice.amount,
    0,
  );
  const taxAmount = Math.round(subtotal * draft.pricing.taxRate);
  const total = subtotal + taxAmount;
  return {
    ...draft,
    pricing: { ...draft.pricing, subtotal, taxAmount, total },
  };
}

export interface UseBidDraftResult {
  draft: BidDraft;
  setDraft: (next: BidDraft | ((d: BidDraft) => BidDraft)) => void;
  patch: (partial: Partial<BidDraft>) => void;
  reset: () => void;
  exists: boolean;
}

export function useBidDraft(tenderId: string): UseBidDraftResult {
  const [draft, setDraftState] = useState<BidDraft>(() => {
    const existing = readDraft<BidDraft>(tenderId);
    return existing ?? makeEmptyDraft(tenderId);
  });
  const [exists, setExists] = useState<boolean>(() => !!readDraft(tenderId));

  // Persist on every change.
  useEffect(() => {
    const withTimestamp: BidDraft = { ...draft, updatedAt: new Date().toISOString() };
    writeDraft(tenderId, withTimestamp);
    setExists(true);
  }, [draft, tenderId]);

  const setDraft = useCallback((next: BidDraft | ((d: BidDraft) => BidDraft)) => {
    setDraftState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      return recomputePricing(resolved);
    });
  }, []);

  const patch = useCallback((partial: Partial<BidDraft>) => {
    setDraftState((prev) => recomputePricing({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    clearDraft(tenderId);
    setDraftState(makeEmptyDraft(tenderId));
    setExists(false);
  }, [tenderId]);

  return useMemo(() => ({ draft, setDraft, patch, reset, exists }), [draft, setDraft, patch, reset, exists]);
}