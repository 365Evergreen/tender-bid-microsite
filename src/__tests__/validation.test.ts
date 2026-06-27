/**
 * Smoke test — validation schemas produce expected errors.
 *
 * Real frontend coverage would test components, but the schemas are the
 * most-likely-to-break invariant of the scaffold and they're pure functions
 * so we test them cheaply here.
 */

import { describe, it, expect } from 'vitest';

import {
  loginSchema,
  registerSchema,
  bidPricingSchema,
  bidComplianceSchema,
} from '@/utils/validation';

describe('loginSchema', () => {
  it('rejects missing email', () => {
    const r = loginSchema.safeParse({ email: '', password: 'abc' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = loginSchema.safeParse({ email: 'not-an-email', password: 'abc' });
    expect(r.success).toBe(false);
  });

  it('accepts valid credentials', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', password: 'secret' });
    expect(r.success).toBe(true);
  });
});

describe('registerSchema', () => {
  it('rejects short password', () => {
    const r = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'short',
      confirmPassword: 'short',
      acceptTerms: true,
    });
    expect(r.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const r = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'all-lower-1234',
      confirmPassword: 'all-lower-1234',
      acceptTerms: true,
    });
    expect(r.success).toBe(false);
  });

  it('rejects mismatched confirmation', () => {
    const r = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'ValidPass1',
      confirmPassword: 'ValidPass2',
      acceptTerms: true,
    });
    expect(r.success).toBe(false);
  });

  it('rejects when terms not accepted', () => {
    const r = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'ValidPass1',
      confirmPassword: 'ValidPass1',
      acceptTerms: false,
    });
    expect(r.success).toBe(false);
  });

  it('accepts valid registration', () => {
    const r = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'ValidPass1',
      confirmPassword: 'ValidPass1',
      acceptTerms: true,
    });
    expect(r.success).toBe(true);
  });
});

describe('bidPricingSchema', () => {
  it('rejects empty line items', () => {
    const r = bidPricingSchema.safeParse({
      currency: 'AUD',
      lineItems: [],
      taxRate: 0.1,
    });
    expect(r.success).toBe(false);
  });

  it('rejects taxRate > 1', () => {
    const r = bidPricingSchema.safeParse({
      currency: 'AUD',
      lineItems: [
        { id: '1', description: 'Item', quantity: 1, unitPrice: { amount: 100, currency: 'AUD' } },
      ],
      taxRate: 1.5,
    });
    expect(r.success).toBe(false);
  });

  it('accepts valid pricing', () => {
    const r = bidPricingSchema.safeParse({
      currency: 'AUD',
      lineItems: [
        { id: '1', description: 'Item', quantity: 2, unitPrice: { amount: 10000, currency: 'AUD' } },
      ],
      taxRate: 0.1,
    });
    expect(r.success).toBe(true);
  });
});

describe('bidComplianceSchema', () => {
  it('requires terms acceptance', () => {
    const r = bidComplianceSchema.safeParse({
      conflictOfInterestDeclared: false,
      acceptsTermsAndConditions: false,
      acceptsCodeOfConduct: true,
      insuranceVerified: true,
    });
    expect(r.success).toBe(false);
  });

  it('requires insurance confirmation', () => {
    const r = bidComplianceSchema.safeParse({
      conflictOfInterestDeclared: false,
      acceptsTermsAndConditions: true,
      acceptsCodeOfConduct: true,
      insuranceVerified: false,
    });
    expect(r.success).toBe(false);
  });

  it('requires conflict-of-interest details when declared', () => {
    const r = bidComplianceSchema.safeParse({
      conflictOfInterestDeclared: true,
      conflictOfInterestDetails: '',
      acceptsTermsAndConditions: true,
      acceptsCodeOfConduct: true,
      insuranceVerified: true,
    });
    expect(r.success).toBe(false);
  });

  it('accepts valid compliance', () => {
    const r = bidComplianceSchema.safeParse({
      conflictOfInterestDeclared: false,
      acceptsTermsAndConditions: true,
      acceptsCodeOfConduct: true,
      insuranceVerified: true,
    });
    expect(r.success).toBe(true);
  });
});