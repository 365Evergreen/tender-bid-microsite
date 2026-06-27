/**
 * Vendor (registered bidder) type.
 *
 * Captures the legal entity + the primary contact person on the bid.
 * Two distinct identities intentionally merged into one record — the
 * microsite treats each company as a single "vendor account".
 */

export interface VendorCompany {
  legalName: string;
  tradingName?: string;
  registrationNumber: string; // ABN / Companies House / EIN equivalent
  taxId?: string;
  registeredAddress: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
  };
  industry?: string;
  yearsTrading?: number;
  employeeCount?: number;
}

export interface VendorContact {
  fullName: string;
  role: string;
  email: string;
  phone: string;
}

export interface Vendor {
  id: string;
  email: string; // login email
  passwordHash?: string; // server-side only; never on the wire
  company: VendorCompany;
  contact: VendorContact;
  status: 'pending_verification' | 'verified' | 'suspended';
  createdAt: string; // ISO 8601
  verifiedAt?: string;
}

/** What the client-side auth context actually holds. */
export interface AuthenticatedVendor {
  id: string;
  email: string;
  company: VendorCompany;
  contact: VendorContact;
}