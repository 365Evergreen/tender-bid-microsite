/**
 * Tender (the bid opportunity) type.
 *
 * A tender is issued by the procurement body. Vendors bid against it.
 * Each tender has a deadline, a set of required documents, and a contact
 * for clarifications.
 */

export type TenderCategory =
  | 'construction'
  | 'it_services'
  | 'consulting'
  | 'supplies'
  | 'maintenance'
  | 'professional_services';

export type TenderStatus =
  | 'draft' // procurement drafting, not yet public
  | 'open' // accepting bids
  | 'closing_soon' // < 7 days remaining
  | 'closed' // past deadline
  | 'awarded';

export interface TenderContact {
  name: string;
  email: string;
  phone?: string;
}

export interface TenderDocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  /** Accepted MIME types. */
  acceptedTypes: string[];
  /** Max upload size in MB. */
  maxSizeMB: number;
}

export interface Tender {
  id: string;
  reference: string; // e.g. "RFT-2026-0142"
  title: string;
  category: TenderCategory;
  description: string; // long-form, markdown
  buyer: string; // procurement body name
  contact: TenderContact;
  status: TenderStatus;
  /** ISO 8601. */
  publishedAt: string;
  /** ISO 8601. */
  closingAt: string;
  /** Estimated contract value in minor units (cents) + ISO currency. */
  estimatedValue: {
    amount: number;
    currency: string;
  };
  /** Geographic scope. */
  location: string;
  documentRequirements: TenderDocumentRequirement[];
}

export interface TenderSummary {
  id: string;
  reference: string;
  title: string;
  category: TenderCategory;
  buyer: string;
  location: string;
  status: TenderStatus;
  closingAt: string;
  estimatedValue: Tender['estimatedValue'];
}