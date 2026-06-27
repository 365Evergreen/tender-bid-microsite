/**
 * HomePage — landing for the portal.
 *
 * Editorial hero: serif headline, sans subtitle, single primary CTA. Three
 * featured tenders below. Process section explains the four steps.
 */

import { makeStyles, tokens } from '@fluentui/react-components';
import { ArrowRight20Regular, Calendar20Regular } from '@fluentui/react-icons';
import { Link as RouterLink } from 'react-router-dom';

import { useFeaturedTenders } from '@/hooks/useTenders';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency, relativeDays } from '@/utils/format';
import { NavButton } from '@/components/common/NavButton';

const useStyles = makeStyles({
  hero: {
    padding: `${tokens.spacingVerticalXXL} 0`,
    borderBottom: '1px solid #C5D0DA',
    marginBottom: tokens.spacingVerticalXL,
  },
  eyebrow: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#B8860B',
    fontWeight: 600,
    marginBottom: tokens.spacingVerticalS,
  },
  headline: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 600,
    color: '#1A2B3C',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    marginBottom: tokens.spacingVerticalL,
    maxWidth: '780px',
  },
  subhead: {
    fontSize: '17px',
    color: '#26405A',
    lineHeight: 1.6,
    maxWidth: '620px',
    marginBottom: tokens.spacingVerticalXL,
  },
  cta: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '28px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalL,
    borderBottom: '1px solid #E2E7EC',
    paddingBottom: tokens.spacingVerticalM,
  },
  featured: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalXXL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  tenderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    transition: 'border-color 120ms ease, transform 120ms ease',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    '&:hover': {
      borderTopColor: '#B8860B',
      borderRightColor: '#B8860B',
      borderBottomColor: '#B8860B',
      borderLeftColor: '#B8860B',
    },
  },
  tenderRef: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalXS,
  },
  tenderTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalS,
    lineHeight: 1.3,
  },
  tenderBuyer: {
    fontSize: '13px',
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalM,
  },
  tenderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#26405A',
    paddingTop: tokens.spacingVerticalS,
    borderTop: '1px dashed #E2E7EC',
  },
  tenderMetaValue: {
    fontWeight: 600,
    color: '#B8860B',
  },
  process: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  processStep: {
    borderLeft: '3px solid #B8860B',
    paddingLeft: tokens.spacingVerticalL,
  },
  processNumber: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '32px',
    color: '#B8860B',
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: tokens.spacingVerticalS,
  },
  processTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
  },
  processDesc: {
    fontSize: '13px',
    color: '#5A7186',
    lineHeight: 1.5,
  },
});

export function HomePage() {
  const styles = useStyles();
  const { data: featured, isLoading } = useFeaturedTenders();

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>Vendor tender bid portal</div>
        <h1 className={styles.headline}>
          Submit your bid against open tenders with confidence.
        </h1>
        <p className={styles.subhead}>
          Register your company, review open opportunities, and submit a
          compliant bid with full supporting documentation — all in one place.
          Built for transparency, fairness, and timely response.
        </p>
        <div className={styles.cta}>
                    <NavButton
                      appearance="primary"
                      size="large"
                      icon={<ArrowRight20Regular />}
                      iconPosition="after"
                      to="/tenders"
                    >
                      Browse open tenders
                    </NavButton>
                    <NavButton
                      appearance="subtle"
                      size="large"
                      to="/register"
                    >
                      Register as vendor
                    </NavButton>
                  </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Featured open tenders</h2>
        {isLoading && <Loading label="Loading tenders…" />}
        {!isLoading && (!featured || featured.length === 0) && (
          <EmptyState
            title="No open tenders right now"
            description="Check back soon — new opportunities are published regularly."
            action={
                            <NavButton appearance="primary" to="/tenders">
                              Browse all tenders
                            </NavButton>
                          }
          />
        )}
        {!isLoading && featured && featured.length > 0 && (
          <div className={styles.featured}>
            {featured.map((t) => (
              <RouterLink key={t.id} to={`/tenders/${t.id}`} className={styles.tenderCard}>
                <div className={styles.tenderRef}>{t.reference}</div>
                <div className={styles.tenderTitle}>{t.title}</div>
                <div className={styles.tenderBuyer}>{t.buyer}</div>
                <div className={styles.tenderMeta}>
                  <span>
                    <Calendar20Regular /> {relativeDays(t.closingAt)}
                  </span>
                  <span className={styles.tenderMetaValue}>
                    {formatCurrency(t.estimatedValue.amount, t.estimatedValue.currency)}
                  </span>
                </div>
              </RouterLink>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '64px' }}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.process}>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>1</div>
            <div className={styles.processTitle}>Register your company</div>
            <p className={styles.processDesc}>
              Create a vendor account with your legal entity details and primary
              contact.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>2</div>
            <div className={styles.processTitle}>Find a tender</div>
            <p className={styles.processDesc}>
              Browse open opportunities filtered by category, status, and
              closing date.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>3</div>
            <div className={styles.processTitle}>Submit your bid</div>
            <p className={styles.processDesc}>
              Complete the multi-step form with pricing, compliance, and
              supporting documents.
            </p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>4</div>
            <div className={styles.processTitle}>Track outcome</div>
            <p className={styles.processDesc}>
              Receive a reference number and track your bid through review and
              award.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}