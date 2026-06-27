/**
 * TenderDetailPage — single tender view with bid action.
 */

import { makeStyles, tokens, Button } from '@fluentui/react-components';
import { ArrowRight20Regular, Calendar20Regular, Mail20Regular } from '@fluentui/react-icons';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { useTender } from '@/hooks/useTenders';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/common/Loading';
import { formatCurrency, formatDate, relativeDays } from '@/utils/format';
import { NavButton } from '@/components/common/NavButton';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: tokens.spacingHorizontalXL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  breadcrumb: {
    fontSize: '12px',
    color: '#5A7186',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: tokens.spacingVerticalS,
  },
  ref: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#B8860B',
    fontWeight: 600,
    marginBottom: tokens.spacingVerticalS,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '40px',
    fontWeight: 600,
    color: '#1A2B3C',
    lineHeight: 1.15,
    marginBottom: tokens.spacingVerticalM,
    letterSpacing: '-0.02em',
  },
  buyer: {
    fontSize: '16px',
    color: '#26405A',
    marginBottom: tokens.spacingVerticalL,
  },
  description: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#26405A',
    whiteSpace: 'pre-wrap',
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '22px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalXL,
  },
  requirements: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  reqItem: {
    padding: tokens.spacingVerticalM,
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
  },
  reqTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: tokens.spacingVerticalXS,
  },
  reqName: {
    fontWeight: 600,
    color: '#1A2B3C',
  },
  reqRequired: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#B8860B',
    fontWeight: 600,
  },
  reqDesc: {
    fontSize: '13px',
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalXS,
  },
  reqMeta: {
    fontSize: '12px',
    color: '#5A7186',
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    height: 'fit-content',
    position: 'sticky',
    top: tokens.spacingVerticalL,
  },
  sidebarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: '1px dashed #E2E7EC',
    fontSize: '14px',
  },
  sidebarRowLast: {
    borderBottom: 'none',
  },
  sidebarLabel: {
    color: '#5A7186',
  },
  sidebarValue: {
    color: '#1A2B3C',
    fontWeight: 500,
  },
  sidebarValueAccent: {
    color: '#B8860B',
    fontWeight: 600,
  },
  sidebarAction: {
    marginTop: tokens.spacingVerticalL,
    width: '100%',
  },
  sidebarContact: {
    marginTop: tokens.spacingVerticalL,
    paddingTop: tokens.spacingVerticalL,
    borderTop: '1px solid #E2E7EC',
    fontSize: '13px',
    color: '#5A7186',
  },
});

export function TenderDetailPage() {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const { data: tender, isLoading } = useTender(id);
  const { status } = useAuth();

  if (isLoading) return <Loading label="Loading tender…" />;
  if (!tender) {
    return (
      <div>
        <h1>Tender not found</h1>
        <p>The tender you’re looking for doesn’t exist or has been removed.</p>
        <NavButton to="/tenders" appearance="primary">
                    Back to all tenders
                  </NavButton>
      </div>
    );
  }

  const canBid = tender.status === 'open' || tender.status === 'closing_soon';
  const isClosed = tender.status === 'closed' || tender.status === 'awarded';

  return (
    <div className={styles.root}>
      <article>
        <div className={styles.breadcrumb}>
          <RouterLink to="/tenders" style={{ color: 'inherit' }}>
            All tenders
          </RouterLink>
        </div>
        <div className={styles.ref}>{tender.reference}</div>
        <h1 className={styles.title}>{tender.title}</h1>
        <div className={styles.buyer}>{tender.buyer}</div>

        <p className={styles.description}>{tender.description}</p>

        <h2 className={styles.sectionTitle}>Required documents</h2>
        {tender.documentRequirements.length === 0 ? (
          <p style={{ color: '#5A7186' }}>No specific documents required.</p>
        ) : (
          <div className={styles.requirements}>
            {tender.documentRequirements.map((req) => (
              <div key={req.id} className={styles.reqItem}>
                <div className={styles.reqTitle}>
                  <span className={styles.reqName}>{req.name}</span>
                  {req.required && <span className={styles.reqRequired}>Required</span>}
                </div>
                <p className={styles.reqDesc}>{req.description}</p>
                <div className={styles.reqMeta}>
                  Accepted formats: {req.acceptedTypes.join(', ')} · Max size{' '}
                  {req.maxSizeMB} MB
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarRow}>
          <span className={styles.sidebarLabel}>Status</span>
          <span className={styles.sidebarValueAccent}>
            {tender.status.replace('_', ' ')}
          </span>
        </div>
        <div className={styles.sidebarRow}>
          <span className={styles.sidebarLabel}>Category</span>
          <span className={styles.sidebarValue}>{tender.category.replace('_', ' ')}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span className={styles.sidebarLabel}>Published</span>
          <span className={styles.sidebarValue}>{formatDate(tender.publishedAt)}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span className={styles.sidebarLabel}>Closes</span>
          <span className={styles.sidebarValue}>
            <Calendar20Regular /> {formatDate(tender.closingAt)}
          </span>
        </div>
        <div className={styles.sidebarRow}>
          <span className={styles.sidebarLabel}>Closing in</span>
          <span className={styles.sidebarValue}>{relativeDays(tender.closingAt)}</span>
        </div>
        <div className={`${styles.sidebarRow} ${styles.sidebarRowLast}`}>
          <span className={styles.sidebarLabel}>Est. value</span>
          <span className={styles.sidebarValueAccent}>
            {formatCurrency(tender.estimatedValue.amount, tender.estimatedValue.currency)}
          </span>
        </div>

        {canBid && status === 'authenticated' && (
                    <NavButton
                      className={styles.sidebarAction}
                      appearance="primary"
                      size="large"
                      icon={<ArrowRight20Regular />}
                      iconPosition="after"
                      to={`/tenders/${tender.id}/bid`}
                    >
                      Start a bid
                    </NavButton>
                  )}
                  {canBid && status !== 'authenticated' && (
                    <>
                      <NavButton
                        className={styles.sidebarAction}
                        appearance="primary"
                        size="large"
                        to="/login"
                      >
                        Sign in to bid
                      </NavButton>
                      <NavButton
                        className={styles.sidebarAction}
                        appearance="subtle"
                        size="large"
                        to="/register"
                      >
                        Register as vendor
                      </NavButton>
                    </>
                  )}
        {isClosed && (
          <Button
            className={styles.sidebarAction}
            appearance="subtle"
            size="large"
            disabled
          >
            Bidding closed
          </Button>
        )}

        <div className={styles.sidebarContact}>
          <strong style={{ color: '#1A2B3C' }}>Clarification contact</strong>
          <div style={{ marginTop: '8px' }}>
            {tender.contact.name}
            <br />
            <Mail20Regular /> {tender.contact.email}
            {tender.contact.phone && (
              <>
                <br />
                {tender.contact.phone}
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}