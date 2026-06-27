/**
 * Sample vendor fixtures — pre-seeded for the mock backend.
 *
 * One pre-verified vendor with password "Demo1234!" so the dev can log in
 * immediately and explore the bid flow without registering.
 */

import type { Vendor } from '@/types';

export const sampleVendors: Vendor[] = [
  {
    id: 'vnd_demo',
    email: 'demo@aurelia.eng.au',
    company: {
      legalName: 'Aurelia Engineering Pty Ltd',
      tradingName: 'Aurelia Engineering',
      registrationNumber: 'ACN 612 998 421',
      taxId: '48 612 998 421',
      registeredAddress: {
        line1: 'Level 4, 88 Bourke Street',
        city: 'Melbourne',
        region: 'VIC',
        postcode: '3000',
        country: 'Australia',
      },
      industry: 'Engineering — Renewable Energy',
      yearsTrading: 12,
      employeeCount: 48,
    },
    contact: {
      fullName: 'Isabelle Chen',
      role: 'Bid Manager',
      email: 'demo@aurelia.eng.au',
      phone: '+61 3 9000 0000',
    },
    status: 'verified',
    createdAt: '2024-08-12T09:00:00.000Z',
    verifiedAt: '2024-08-15T14:30:00.000Z',
  },
];