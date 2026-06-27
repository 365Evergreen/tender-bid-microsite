/**
 * Bid step 6: Review and submit.
 *
 * Read-only summary of everything entered across the previous 5 steps,
 * grouped by section. The vendor reviews then submits.
 */

import { makeStyles, tokens } from '@fluentui/react-components';

import { formatCurrency, formatDate } from '@/utils/format';
import type { BidDraft, BidDocument } from '@/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  section: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
  },
  sectionTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalM,
    borderBottom: '1px solid #E2E7EC',
    paddingBottom: tokens.spacingVerticalS,
  },
  dl: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    gap: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    fontSize: '14px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  dt: {
    color: '#5A7186',
    fontWeight: 500,
  },
  dd: {
    color: '#1A2B3C',
    margin: 0,
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} 0`,
    marginTop: tokens.spacingVerticalS,
    borderTop: '2px solid #1A2B3C',
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1A2B3C',
  },
  totalValue: {
    color: '#B8860B',
  },
  docList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  docItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingVerticalS}`,
    backgroundColor: '#F4F6F8',
    borderRadius: '2px',
    fontSize: '13px',
  },
});

export interface ReviewStepProps {
  draft: BidDraft;
  documents: BidDocument[];
}

export function ReviewStep({ draft, documents }: ReviewStepProps) {
  const styles = useStyles();
  const subtotal = draft.pricing.lineItems.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice.amount,
    0,
  );
  const tax = Math.round(subtotal * draft.pricing.taxRate);
  const total = subtotal + tax;

  return (
    <div className={styles.root}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Company</h3>
        <dl className={styles.dl}>
          <dt className={styles.dt}>Legal name</dt>
          <dd className={styles.dd}>{draft.company.legalName}</dd>
          <dt className={styles.dt}>Registration</dt>
          <dd className={styles.dd}>{draft.company.registrationNumber}</dd>
          <dt className={styles.dt}>Address</dt>
          <dd className={styles.dd}>
            {[
              draft.company.registeredAddress.line1,
              draft.company.registeredAddress.line2,
              draft.company.registeredAddress.city,
              draft.company.registeredAddress.region,
              draft.company.registeredAddress.postcode,
              draft.company.registeredAddress.country,
            ]
              .filter(Boolean)
              .join(', ')}
          </dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Primary contact</h3>
        <dl className={styles.dl}>
          <dt className={styles.dt}>Name</dt>
          <dd className={styles.dd}>{draft.contact.fullName}</dd>
          <dt className={styles.dt}>Role</dt>
          <dd className={styles.dd}>{draft.contact.role}</dd>
          <dt className={styles.dt}>Email</dt>
          <dd className={styles.dd}>{draft.contact.email}</dd>
          <dt className={styles.dt}>Phone</dt>
          <dd className={styles.dd}>{draft.contact.phone}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Pricing</h3>
        <dl className={styles.dl}>
          <dt className={styles.dt}>Currency</dt>
          <dd className={styles.dd}>{draft.pricing.currency}</dd>
          <dt className={styles.dt}>Line items</dt>
          <dd className={styles.dd}>
            <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
              {draft.pricing.lineItems.map((li) => (
                <li key={li.id}>
                  {li.description} — {li.quantity} ×{' '}
                  {formatCurrency(li.unitPrice.amount, li.unitPrice.currency)}
                </li>
              ))}
            </ul>
          </dd>
          <dt className={styles.dt}>Tax rate</dt>
          <dd className={styles.dd}>{(draft.pricing.taxRate * 100).toFixed(1)}%</dd>
        </dl>
        <div className={styles.total}>
          <span>Total bid value</span>
          <span className={styles.totalValue}>
            {formatCurrency(total, draft.pricing.currency)}
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Compliance</h3>
        <dl className={styles.dl}>
          <dt className={styles.dt}>Conflict of interest</dt>
          <dd className={styles.dd}>
            {draft.compliance.conflictOfInterestDeclared
              ? `Declared: ${draft.compliance.conflictOfInterestDetails ?? '(no details)'}`
              : 'None declared'}
          </dd>
          <dt className={styles.dt}>Insurance</dt>
          <dd className={styles.dd}>
            Verified
            {draft.compliance.insuranceExpiryDate &&
              ` (expires ${formatDate(draft.compliance.insuranceExpiryDate)})`}
          </dd>
          <dt className={styles.dt}>Terms & conditions</dt>
          <dd className={styles.dd}>
            {draft.compliance.acceptsTermsAndConditions ? 'Accepted' : 'Not accepted'}
          </dd>
          <dt className={styles.dt}>Code of conduct</dt>
          <dd className={styles.dd}>
            {draft.compliance.acceptsCodeOfConduct ? 'Accepted' : 'Not accepted'}
          </dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Documents ({documents.length})</h3>
        {documents.length === 0 ? (
          <p style={{ color: '#5A7186', margin: 0 }}>No documents uploaded</p>
        ) : (
          <ul className={styles.docList}>
            {documents.map((d) => (
              <li key={d.id} className={styles.docItem}>
                <span>{d.filename}</span>
                <span style={{ color: '#5A7186' }}>{d.kind}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}