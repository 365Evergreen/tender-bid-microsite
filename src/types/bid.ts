/**
 * Bid (vendor's submission) type.
 *
 * A bid is the vendor's response to a tender. It has a multi-step form
 * (company details, pricing, compliance, documents, review) and a
 * lifecycle (draft → submitted → under_review → accepted/rejected).
 */

import type { VendorCompany, VendorContact } from './user';

export type BidStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface BidLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: {
    amount: number; // cents
    currency: string;
  };
}

export interface BidPricing {
  currency: string;
  lineItems: BidLineItem[];
  /** Computed; not authoritative until submit. */
  subtotal: number;
  taxRate: number; // 0.10 = 10%
  taxAmount: number;
  total: number;
}

export interface BidCompliance {
  conflictOfInterestDeclared: boolean;
  conflictOfInterestDetails?: string;
  acceptsTermsAndConditions: boolean;
  acceptsCodeOfConduct: boolean;
  insuranceVerified: boolean;
  insuranceExpiryDate?: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  status: BidStatus;
  /** Snapshot of company at bid-time — even if vendor profile changes later. */
  companySnapshot: VendorCompany;
  /** Snapshot of primary contact. */
  contactSnapshot: VendorContact;
  pricing: BidPricing;
  compliance: BidCompliance;
  /** Document IDs referenced (resolves against the documents endpoint). */
  documentIds: string[];
  /** Free-text proposal narrative. */
  proposal?: string;
  /** ISO 8601 timestamps. */
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  /** Reference number assigned on submission (e.g. "BID-2026-0042"). */
  reference?: string;
}

/** Working draft — local-only, persisted to localStorage between sessions. */
export interface BidDraft {
  tenderId: string;
  company: VendorCompany;
  contact: VendorContact;
  pricing: BidPricing;
  compliance: BidCompliance;
  proposal?: string;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  updatedAt: string;
}