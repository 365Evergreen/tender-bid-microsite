/**
 * MSW request handlers — the mock backend.
 *
 * Covers all endpoints the client uses. Returns realistic shapes (with
 * delays, occasionally) so the UI behaves like production.
 */

import { http, HttpResponse, delay } from 'msw';

import { db } from './db';
import type {
  Bid,
  BidDocument,
  LoginResponse,
  RegisterResponse,
  TenderSummary,
  PaginatedResponse,
  ApiErrorResponse,
  AuthenticatedVendor,
} from '@/types';

// ---------- Helpers ----------

const NETWORK_DELAY_MS = 200;

function err(status: number, code: string, message: string, fieldErrors?: Record<string, string>): Response {
  const body: ApiErrorResponse = { error: { code, message, fieldErrors } };
  return HttpResponse.json(body, { status });
}

function tokenForVendor(vendorId: string): { token: string; expiresAt: string } {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(); // 8 hours
  // Demo token — real backend would sign with HMAC + vendor claim.
  const token = `mock.${vendorId}.${expiresAt}`;
  return { token, expiresAt };
}

function toSummary(t: import('@/types').Tender): TenderSummary {
  return {
    id: t.id,
    reference: t.reference,
    title: t.title,
    category: t.category,
    buyer: t.buyer,
    location: t.location,
    status: t.status,
    closingAt: t.closingAt,
    estimatedValue: t.estimatedValue,
  };
}

// ---------- Auth handlers ----------

const authHandlers = [
  http.post('/api/v1/auth/register', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const body = (await request.json()) as {
      email: string;
      password: string;
      company: AuthenticatedVendor['company'];
      contact: AuthenticatedVendor['contact'];
    };

    if (!body.email || !body.password) {
      return err(400, 'validation_failed', 'Email and password are required');
    }
    if (db.findVendorByEmail(body.email)) {
      return err(409, 'email_exists', 'An account already exists with this email');
    }

    const newVendor = {
      id: `vnd_${crypto.randomUUID().slice(0, 8)}`,
      email: body.email,
      company: body.company,
      contact: body.contact,
      status: 'pending_verification' as const,
      createdAt: new Date().toISOString(),
    };
    db.addVendor(newVendor);

    const res: RegisterResponse = {
      vendor: {
        id: newVendor.id,
        email: newVendor.email,
        company: newVendor.company,
        contact: newVendor.contact,
      },
      requiresVerification: true,
    };
    return HttpResponse.json(res, { status: 201 });
  }),

  http.post('/api/v1/auth/login', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const body = (await request.json()) as { email: string; password: string };

    // Demo password for all seeded vendors.
    if (body.password !== 'Demo1234!') {
      return err(401, 'invalid_credentials', 'Email or password is incorrect');
    }
    const vendor = db.findVendorByEmail(body.email);
    if (!vendor) {
      return err(401, 'invalid_credentials', 'Email or password is incorrect');
    }

    const { token, expiresAt } = tokenForVendor(vendor.id);
    const res: LoginResponse = {
      token,
      expiresAt,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        company: vendor.company,
        contact: vendor.contact,
      },
    };
    return HttpResponse.json(res);
  }),

  http.post('/api/v1/auth/logout', async () => {
    await delay(50);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/v1/auth/me', async ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer mock.vnd_')) {
      return err(401, 'unauthenticated', 'Sign in required');
    }
    const vendorId = auth.replace('Bearer mock.', '').split('.')[0];
    const vendor = db.findVendorById(vendorId);
    if (!vendor) return err(401, 'unauthenticated', 'Session expired');
    const authVendor: AuthenticatedVendor = {
      id: vendor.id,
      email: vendor.email,
      company: vendor.company,
      contact: vendor.contact,
    };
    return HttpResponse.json(authVendor);
  }),
];

// ---------- Tender handlers ----------

const tenderHandlers = [
  http.get('/api/v1/tenders', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search')?.toLowerCase();
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '20');

    let items = db.tenders.map(toSummary);
    if (status) items = items.filter((t) => t.status === status);
    if (category) items = items.filter((t) => t.category === category);
    if (search) {
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.reference.toLowerCase().includes(search) ||
          t.buyer.toLowerCase().includes(search),
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    const res: PaginatedResponse<TenderSummary> = {
      items: paged,
      total,
      page,
      pageSize,
    };
    return HttpResponse.json(res);
  }),

  http.get('/api/v1/tenders/featured', async () => {
    await delay(NETWORK_DELAY_MS);
    const items = db.tenders
      .filter((t) => t.status === 'open' || t.status === 'closing_soon')
      .slice(0, 3)
      .map(toSummary);
    return HttpResponse.json(items);
  }),

  http.get('/api/v1/tenders/:id', async ({ params }) => {
    await delay(NETWORK_DELAY_MS);
    const t = db.tenders.find((x) => x.id === params.id);
    if (!t) return err(404, 'not_found', 'Tender not found');
    return HttpResponse.json(t);
  }),
];

// ---------- Bids handlers ----------

const bidsHandlers = [
  http.post('/api/v1/bids', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');
    const vendorId = auth.replace('Bearer mock.', '').split('.')[0];

    const body = (await request.json()) as {
      tenderId: string;
      company: Bid['companySnapshot'];
      contact: Bid['contactSnapshot'];
      pricing: Bid['pricing'];
      compliance: Bid['compliance'];
      documentIds: string[];
      proposal?: string;
    };

    const tender = db.tenders.find((t) => t.id === body.tenderId);
    if (!tender) return err(404, 'tender_not_found', 'Tender not found');
    if (tender.status === 'closed' || tender.status === 'awarded') {
      return err(400, 'tender_closed', 'This tender is no longer accepting bids');
    }

    const now = new Date().toISOString();
    const newBid: Bid = {
      id: `bid_${crypto.randomUUID().slice(0, 8)}`,
      tenderId: body.tenderId,
      vendorId,
      status: 'draft',
      companySnapshot: body.company,
      contactSnapshot: body.contact,
      pricing: body.pricing,
      compliance: body.compliance,
      documentIds: body.documentIds,
      proposal: body.proposal,
      createdAt: now,
      updatedAt: now,
    };
    db.addBid(newBid);
    return HttpResponse.json(newBid, { status: 201 });
  }),

  http.patch('/api/v1/bids/:id', async ({ params, request }) => {
    await delay(NETWORK_DELAY_MS);
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');

    const bid = db.findBidById(String(params.id));
    if (!bid) return err(404, 'not_found', 'Bid not found');
    if (bid.status !== 'draft') {
      return err(400, 'bid_locked', 'Submitted bids cannot be edited');
    }

    const patch = (await request.json()) as Partial<Bid>;
    const updated = db.updateBid(bid.id, { ...patch, updatedAt: new Date().toISOString() });
    return HttpResponse.json(updated);
  }),

  http.post('/api/v1/bids/:id/submit', async ({ params }) => {
    await delay(NETWORK_DELAY_MS);
    const bid = db.findBidById(String(params.id));
    if (!bid) return err(404, 'not_found', 'Bid not found');
    if (bid.status !== 'draft') {
      return err(400, 'already_submitted', 'Bid has already been submitted');
    }
    const now = new Date().toISOString();
    const reference = `BID-${new Date().getFullYear()}-${String(db.bids.length).padStart(4, '0')}`;
    const updated = db.updateBid(bid.id, {
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
      reference,
    });
    return HttpResponse.json(updated);
  }),

  http.get('/api/v1/bids/mine', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');
    const vendorId = auth.replace('Bearer mock.', '').split('.')[0];
    return HttpResponse.json(db.bidsByVendor(vendorId));
  }),

  http.get('/api/v1/bids/:id', async ({ params, request }) => {
    await delay(NETWORK_DELAY_MS);
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');
    const bid = db.findBidById(String(params.id));
    if (!bid) return err(404, 'not_found', 'Bid not found');
    return HttpResponse.json(bid);
  }),
];

// ---------- Documents handlers (multipart upload) ----------

const documentHandlers = [
  http.post('/api/v1/documents', async ({ request }) => {
    await delay(800); // upload feels slower than JSON
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');
    const vendorId = auth.replace('Bearer mock.', '').split('.')[0];

    const form = await request.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') ?? 'other');

    if (!(file instanceof File)) {
      return err(400, 'no_file', 'No file uploaded');
    }
    if (file.size > 100 * 1024 * 1024) {
      return err(413, 'file_too_large', 'File exceeds 100 MB limit');
    }

    const newDoc: BidDocument = {
      id: `doc_${crypto.randomUUID().slice(0, 8)}`,
      vendorId,
      kind: kind as BidDocument['kind'],
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      url: `mock://documents/${file.name}`,
      uploadedAt: new Date().toISOString(),
      scanStatus: 'clean',
    };
    db.addDocument(newDoc);
    return HttpResponse.json(newDoc, { status: 201 });
  }),

  http.get('/api/v1/documents/mine', async ({ request }) => {
    await delay(NETWORK_DELAY_MS);
    const auth = request.headers.get('Authorization');
    if (!auth) return err(401, 'unauthenticated', 'Sign in required');
    const vendorId = auth.replace('Bearer mock.', '').split('.')[0];
    return HttpResponse.json(db.documentsByVendor(vendorId));
  }),
];

// ---------- Reset (dev utility) ----------

const devHandlers = [
  http.post('/api/v1/_dev/reset', async () => {
    db.reset();
    return new HttpResponse(null, { status: 204 });
  }),
];

export const handlers = [
  ...authHandlers,
  ...tenderHandlers,
  ...bidsHandlers,
  ...documentHandlers,
  ...devHandlers,
];