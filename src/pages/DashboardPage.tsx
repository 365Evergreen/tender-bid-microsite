/**
 * DashboardPage — vendor's home: their bids + quick links.
 *
 * Minimal for the scaffold: shows the vendor's submitted + draft bids.
 * Future: bid history, profile, document library.
 */

import { makeStyles, tokens, Button } from '@fluentui/react-components';
import { useQuery } from '@tanstack/react-query';

import { listMyBids } from '@/services/bids';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { NavButton } from '@/components/common/NavButton';
import { formatCurrency, formatDate } from '@/utils/format';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '32px',
    fontWeight: 600,
    color: '#1A2B3C',
  },
  subtitle: {
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalL,
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
  },
  bidRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    borderBottom: '1px dashed #E2E7EC',
    alignItems: 'center',
    fontSize: '14px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bidRef: {
    fontWeight: 600,
    color: '#1A2B3C',
    fontFamily: '"Fraunces", Georgia, serif',
  },
  bidMeta: {
    color: '#5A7186',
    fontSize: '13px',
  },
  bidStatus: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '2px',
    fontWeight: 600,
  },
});

export function DashboardPage() {
  const styles = useStyles();
  const { vendor } = useAuth();
  const { data: bids, isLoading } = useQuery({
    queryKey: ['bids', 'mine'],
    queryFn: listMyBids,
  });

  if (!vendor) return null;

  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.title}>
          Welcome, {vendor.contact.fullName || vendor.company.legalName}
        </h1>
        <p className={styles.subtitle}>
          {vendor.company.legalName} · {vendor.email}
        </p>
      </div>

      <h2
        style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: '20px',
          color: '#1A2B3C',
          marginBottom: tokens.spacingVerticalS,
        }}
      >
        My bids
      </h2>

      {isLoading && <Loading label="Loading your bids…" />}

      {!isLoading && (!bids || bids.length === 0) && (
        <EmptyState
          title="No bids yet"
                      description="When you submit a bid against a tender, it will appear here."
                      action={
                        <NavButton appearance="primary" to="/tenders">
                          Browse open tenders
                        </NavButton>
                      }
        />
      )}

      {!isLoading && bids && bids.length > 0 && (
        <div className={styles.card}>
          {bids.map((b) => {
            const total = b.pricing.lineItems.reduce(
              (acc, li) => acc + li.quantity * li.unitPrice.amount,
              0,
            );
            const withTax = Math.round(total * (1 + b.pricing.taxRate));
            const statusColor =
              b.status === 'submitted'
                ? { bg: '#FCF6E6', fg: '#704D05' }
                : b.status === 'accepted'
                  ? { bg: '#E2F0E5', fg: '#2D5A3D' }
                  : b.status === 'rejected'
                    ? { bg: '#FCE4E4', fg: '#8B2635' }
                    : { bg: '#F4F6F8', fg: '#26405A' };
            return (
              <div key={b.id} className={styles.bidRow}>
                <div>
                  <div className={styles.bidRef}>{b.reference ?? `Draft ${b.id}`}</div>
                  <div className={styles.bidMeta}>
                    {b.submittedAt ? `Submitted ${formatDate(b.submittedAt)}` : `Updated ${formatDate(b.updatedAt)}`}
                  </div>
                </div>
                <div className={styles.bidMeta}>
                  {formatCurrency(withTax, b.pricing.currency)}
                </div>
                <div>
                  <span
                    className={styles.bidStatus}
                    style={{ backgroundColor: statusColor.bg, color: statusColor.fg }}
                  >
                    {b.status}
                  </span>
                </div>
                <div>
                  <Button appearance="subtle" size="small">
                    View details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}