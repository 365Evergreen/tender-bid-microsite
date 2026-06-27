# Tender Bid Microsite

A React + TypeScript frontend microsite that allows vendors to discover
open tenders, register as bidders, and submit fully-formed bids with
pricing, compliance declarations, and supporting documentation.

Built on **Fluent UI v9** with an editorial/document-inspired aesthetic —
Fraunces serif for display, Inter Tight for body, deep slate primary with
warm gold accent on a parchment background. Government-grade without being
a Word template.

---

## Tech stack

| Layer            | Choice                                   |
|------------------|------------------------------------------|
| Build            | Vite 5                                   |
| Framework        | React 18                                 |
| Language         | TypeScript (strict)                      |
| UI system        | Fluent UI v9 (`@fluentui/react-components`) |
| Routing          | react-router-dom v6 (data router)        |
| Forms            | react-hook-form + zod                    |
| Server state     | Tanstack Query                           |
| Mock backend     | MSW (Mock Service Worker)                |
| Testing          | vitest + Testing Library                 |

---

## Getting started

```bash
# 1. Install
npm install

# 2. Generate the MSW service-worker file (only needed once, or after
#    reinstalling msw).
npm run msw:init

# 3. Run the dev server. MSW boots automatically — no real backend needed.
npm run dev
```

The app runs at <http://localhost:5173>.

### Demo credentials

The MSW mock backend seeds one vendor account:

```
Email:    demo@aurelia.eng.au
Password: Demo1234!
```

You can also register a new vendor via `/register` — the mock backend
persists to `localStorage` so reloads preserve session.

---

## Architecture

```
src/
├── main.tsx                  # Entry — boots MSW, mounts providers
├── main.css                  # Base resets
├── vite-env.d.ts
│
├── theme/                    # Design tokens + global stylesheet
│   ├── tokens.ts             # Editorial palette (slate + gold + parchment)
│   ├── globalStyles.ts       # Injected <style> at root
│   └── index.ts
│
├── router/                   # React Router data router + lazy routes
│   └── index.tsx
│
├── components/
│   ├── layout/               # AppShell, Header, Footer
│   ├── common/               # Loading, EmptyState, ErrorBoundary
│   ├── forms/                # (FormField helpers; steps live in bid/)
│   ├── bid/                  # Multi-step bid form sections
│   │   ├── BidStepIndicator.tsx
│   │   ├── CompanyStep.tsx
│   │   ├── ContactStep.tsx
│   │   ├── PricingStep.tsx
│   │   ├── ComplianceStep.tsx
│   │   ├── DocumentsStep.tsx
│   │   └── ReviewStep.tsx
│   └── upload/               # FileDropZone, DocumentUpload, UploadedDocumentRow
│
├── pages/                    # Route components (lazy-loaded)
│   ├── HomePage.tsx
│   ├── TenderListPage.tsx
│   ├── TenderDetailPage.tsx
│   ├── RegisterPage.tsx
│   ├── LoginPage.tsx
│   ├── BidFormPage.tsx       # Orchestrates the multi-step form
│   ├── ConfirmationPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
│
├── hooks/
│   ├── useTenders.ts         # Tanstack Query wrappers
│   ├── useBidDraft.ts        # localStorage-persisted bid draft
│   └── useFileUpload.ts      # Per-file progress + completion list
│
├── services/                 # API client + per-resource modules
│   ├── api.ts                # fetch wrapper + XHR upload with progress
│   ├── auth.ts               # register, login, logout, me
│   ├── tenders.ts            # list, get, featured
│   ├── bids.ts               # create, update, submit, list-mine
│   └── uploads.ts            # multipart upload
│
├── mocks/                    # MSW mock backend (dev only)
│   ├── handlers.ts           # All endpoint handlers
│   ├── browser.ts            # Worker setup
│   ├── db.ts                 # In-memory DB with localStorage persistence
│   └── fixtures/             # Sample tenders + vendors
│
├── types/                    # Shared TS types — single source of truth
│   ├── user.ts               # Vendor / AuthenticatedVendor
│   ├── tender.ts             # Tender + TenderSummary
│   ├── bid.ts                # Bid + BidDraft + line items
│   ├── document.ts           # BidDocument + UploadProgress
│   └── api.ts                # ApiError, PaginatedResponse, LoginResponse
│
├── utils/
│   ├── validation.ts         # zod schemas (one per form)
│   ├── format.ts             # Currency, date, relative-day formatters
│   └── localStorage.ts       # Typed draft persistence
│
├── context/
│   └── AuthContext.tsx       # Single source of truth for "who is logged in"
│
└── __tests__/
    ├── setup.ts
    ├── validation.test.ts
    └── format.test.ts
```

---

## Bid submission flow

```
  ┌─────────────────────────────────────────────────────────────┐
  │ Vendor registers / signs in                                  │
  └─────────────┬───────────────────────────────────────────────┘
                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Browse → TenderListPage → TenderDetailPage                   │
  │ Click "Start a bid" → /tenders/:id/bid                      │
  └─────────────┬───────────────────────────────────────────────┘
                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ BidFormPage — multi-step                                    │
  │   1. Company details   (zod: companySchema)                 │
  │   2. Primary contact   (zod: contactSchema)                 │
  │   3. Pricing           (zod: bidPricingSchema)              │
  │   4. Compliance        (zod: bidComplianceSchema)           │
  │   5. Documents         (per-requirement upload)             │
  │   6. Review & submit   (read-only summary)                  │
  └─────────────┬───────────────────────────────────────────────┘
                ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ ConfirmationPage — shows bid reference + next steps         │
  └─────────────────────────────────────────────────────────────┘
```

The in-progress bid is persisted to `localStorage` after every change so a
vendor can refresh, switch tabs, and come back. Cleared on successful
submit.

---

## Mock backend (MSW)

The mock backend intercepts every request to `/api/v1/*` in dev mode and
returns realistic responses with a small delay. State persists to
`localStorage` under `tender-bid:mock-db` so reloads preserve the dev
session.

To reset the mock state at any time:

```js
// In the browser console:
fetch('/api/v1/_dev/reset', { method: 'POST' });
```

Or clear `localStorage`:

```js
['tender-bid:mock-db', 'tender-bid:session', 'tender-bid:draft:*']
  .forEach((k) => localStorage.removeItem(k));
```

### Production swap

Every endpoint goes through `src/services/api.ts`. Replace MSW with a real
backend by:

1. Setting `VITE_API_BASE_URL` to your API origin.
2. Removing `enableMocking()` from `main.tsx`.
3. The rest of the codebase is unchanged.

---

## Design system

The editorial theme lives in `src/theme/tokens.ts`:

| Token       | Value     | Intent                       |
|-------------|-----------|------------------------------|
| Primary     | `#1A2B3C` | Deep slate — institutional   |
| Accent      | `#B8860B` | Warm gold — emphasis only    |
| Background  | `#FAF7F2` | Parchment — paper-feel       |
| Error       | `#8B2635` | Burgundy — formalised       |
| Success     | `#2D5A3D` | Forest — formalised          |
| Display     | Fraunces  | Serif — headings + numerals  |
| Body        | Inter Tight | Sans — UI + body copy      |

Restrained use of the accent — only on totals, key actions, active state.
Government-grade without feeling like a template.

---

## Scripts

```bash
npm run dev          # Vite dev server + MSW
npm run build        # tsc + Vite production build
npm run preview      # Preview the production build locally
npm run test         # Run vitest once
npm run test:watch   # Vitest watch mode
npm run lint         # ESLint, --max-warnings 0
npm run type-check   # tsc --noEmit
npm run msw:init     # (Re)generate the MSW service-worker file
```

---

## Known scope notes

This is a scaffold, not a finished app. The following are intentionally
left light and would be hardened before production:

- **Document → requirement mapping**: `DocumentsStep` assigns uploaded
  files to the first matching requirement round-robin. A real backend
  would persist an explicit `requirementId` per upload.
- **Bid editing after submit**: The mock backend rejects PATCH on
  non-draft bids. A real system would support clarification amendments
  with an audit trail.
- **Email verification flow**: `register` returns `requiresVerification:
  true` but the UI doesn't gate on it. Real app would email a verification
  link.
- **Form persistence cadence**: the bid draft syncs to localStorage on
  every keystroke. For very large drafts, batch the writes.
- **i18n**: copy is in English-AU only. A real portal would localise.
- **Accessibility**: components use Fluent UI's accessible primitives, but
  a full WCAG 2.2 AA audit is recommended before launch.

---

## License

Internal — for the procurement portal project.