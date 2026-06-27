/**
 * ConfirmationPage — post-submission confirmation.
 *
 * Shows the bid reference, the submitted total, and the next steps.
 */

import { makeStyles, tokens } from '@fluentui/react-components';
import { CheckmarkCircle20Filled, Mail20Regular } from '@fluentui/react-icons';
import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { getBid } from '@/services/bids';
import { Loading } from '@/components/common/Loading';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { NavButton } from '@/components/common/NavButton';

const useStyles = makeStyles({
  root: {
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'center',
  },
  icon: {
    color: '#2D5A3D',
    fontSize: '64px',
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '36px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalM,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '16px',
    color: '#26405A',
    marginBottom: tokens.spacingVerticalXL,
    lineHeight: 1.6,
  },
  referenceCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXL,
    textAlign: 'left',
  },
  referenceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} 0`,
    fontSize: '14px',
  },
  referenceLabel: {
    color: '#5A7186',
  },
  referenceValue: {
    color: '#1A2B3C',
    fontWeight: 500,
  },
  referenceValueAccent: {
    color: '#B8860B',
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '18px',
    fontWeight: 600,
  },
  nextSteps: {
    backgroundColor: '#F4F6F8',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalXL,
    textAlign: 'left',
  },
  nextStepsTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalS,
  },
  nextStepsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    fontSize: '14px',
    color: '#26405A',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

export function ConfirmationPage() {
  const styles = useStyles();
  const { bidId } = useParams<{ bidId: string }>();
  const { data: bid, isLoading } = useQuery({
    queryKey: ['bid', bidId],
    queryFn: () => getBid(bidId as string),
    enabled: !!bidId,
  });

  if (isLoading) return <Loading label="Loading bid…" />;
  if (!bid) return <div>Bid not found.</div>;

  const total =
    bid.pricing.lineItems.reduce(
      (acc, li) => acc + li.quantity * li.unitPrice.amount,
      0,
    ) *
    (1 + bid.pricing.taxRate);

  return (
    <div className={styles.root}>
      <CheckmarkCircle20Filled className={styles.icon} />
      <h1 className={styles.title}>Bid submitted</h1>
      <p className={styles.subtitle}>
        Thank you. Your bid has been received by the procurement body. You
        will receive an email confirmation shortly.
      </p>

      <div className={styles.referenceCard}>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Bid reference</span>
          <span className={styles.referenceValueAccent}>
            {bid.reference ?? bid.id}
          </span>
        </div>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Submitted at</span>
          <span className={styles.referenceValue}>
            {bid.submittedAt ? formatDateTime(bid.submittedAt) : '—'}
          </span>
        </div>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Status</span>
          <span className={styles.referenceValue}>{bid.status}</span>
        </div>
        <div className={styles.referenceRow}>
          <span className={styles.referenceLabel}>Total bid value</span>
          <span className={styles.referenceValueAccent}>
            {formatCurrency(Math.round(total), bid.pricing.currency)}
          </span>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <div className={styles.nextStepsTitle}>What happens next</div>
        <ul className={styles.nextStepsList}>
          <li>
            <Mail20Regular style={{ verticalAlign: 'middle', marginRight: 8 }} />
            A confirmation email with your bid reference has been sent to your
            primary contact.
          </li>
          <li>
            The procurement body will review all bids after the closing date.
          </li>
          <li>
            You will be notified by email if clarification questions are
            raised.
          </li>
          <li>
            Final award decisions will be published on the procurement body's
            website.
          </li>
        </ul>
      </div>

      <div className={styles.actions}>
                <NavButton to="/dashboard" appearance="primary">
                  View my bids
                </NavButton>
                <NavButton to="/tenders" appearance="subtle">
                  Browse more tenders
                </NavButton>
              </div>
    </div>
  );
}