/**
 * Zod validation schemas for all forms.
 *
 * Reused across the registration form, login form, and each step of the
 * multi-step bid submission form. Error messages are user-facing and
 * explain what to do (rather than "invalid input").
 */

import { z } from 'zod';

const requiredString = (label: string, max = 200) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

const emailField = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const passwordField = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

// ---------- Auth ----------

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, 'You must accept the terms and conditions'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// ---------- Company + contact (used in both registration + bid step 1) ----------

export const companySchema = z.object({
  legalName: requiredString('Legal name', 200),
  tradingName: z.string().max(200).optional().or(z.literal('')),
  registrationNumber: requiredString('Registration number', 50),
  taxId: z.string().max(50).optional().or(z.literal('')),
  registeredAddress: z.object({
    line1: requiredString('Address line 1', 200),
    line2: z.string().max(200).optional().or(z.literal('')),
    city: requiredString('City', 100),
    region: requiredString('Region / state', 100),
    postcode: requiredString('Postcode', 20),
    country: requiredString('Country', 100),
  }),
  industry: z.string().max(100).optional().or(z.literal('')),
  yearsTrading: z.coerce.number().int().min(0).optional(),
  employeeCount: z.coerce.number().int().min(0).optional(),
});
export type CompanyInput = z.infer<typeof companySchema>;

export const contactSchema = z.object({
  fullName: requiredString('Full name', 200),
  role: requiredString('Role', 100),
  email: emailField,
  phone: requiredString('Phone', 30),
});
export type ContactInput = z.infer<typeof contactSchema>;

// ---------- Bid: pricing ----------

export const bidLineItemSchema = z.object({
  id: z.string(),
  description: requiredString('Line item description', 200),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  unitPrice: z.object({
    amount: z.coerce.number().nonnegative('Unit price must be zero or more'),
    currency: z.string().length(3, 'Use a 3-letter currency code'),
  }),
});
export type BidLineItemInput = z.infer<typeof bidLineItemSchema>;

export const bidPricingSchema = z.object({
  currency: z
    .string()
    .length(3, 'Use a 3-letter currency code (e.g. AUD, USD)')
    .default('AUD'),
  lineItems: z
    .array(bidLineItemSchema)
    .min(1, 'Add at least one line item'),
  taxRate: z.coerce
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(1, 'Tax rate must be between 0 and 1 (e.g. 0.1 for 10%)'),
});
export type BidPricingInput = z.infer<typeof bidPricingSchema>;

// ---------- Bid: compliance ----------

export const bidComplianceSchema = z
  .object({
    conflictOfInterestDeclared: z.boolean(),
    conflictOfInterestDetails: z.string().max(2000).optional(),
    acceptsTermsAndConditions: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
    acceptsCodeOfConduct: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the code of conduct' }),
    }),
    insuranceVerified: z.literal(true, {
      errorMap: () => ({
        message: 'You must confirm valid insurance is held',
      }),
    }),
    insuranceExpiryDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Use the date picker — format YYYY-MM-DD',
      )
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (d) =>
      !d.conflictOfInterestDeclared ||
      (d.conflictOfInterestDetails && d.conflictOfInterestDetails.length > 0),
    {
      message: 'Describe the conflict of interest',
      path: ['conflictOfInterestDetails'],
    },
  );
export type BidComplianceInput = z.infer<typeof bidComplianceSchema>;

// ---------- Bid: full draft (used by review step) ----------

export const bidDraftSchema = z.object({
  company: companySchema,
  contact: contactSchema,
  pricing: bidPricingSchema,
  compliance: bidComplianceSchema,
  proposal: z.string().max(20_000).optional().or(z.literal('')),
});
export type BidDraftInput = z.infer<typeof bidDraftSchema>;