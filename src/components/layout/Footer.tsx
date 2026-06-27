/**
 * Site footer — institutional information, links, legal.
 *
 * Editorial style: thin top rule, three columns (about / resources / legal),
 * small text, restrained palette.
 */

import { makeStyles, tokens } from '@fluentui/react-components';

import { AppLink } from '@/components/common/AppLink';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#FAF7F2',
    borderTop: '1px solid #C5D0DA',
    marginTop: tokens.spacingVerticalXXL,
  },
  inner: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: tokens.spacingHorizontalXL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    },
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  colTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
  },
  colLink: {
    color: '#3D556B',
    textDecoration: 'none',
    fontSize: '13px',
    '&:hover': {
      color: '#B8860B',
    },
  },
  meta: {
    fontSize: '12px',
    color: '#5A7186',
    lineHeight: 1.6,
  },
  legal: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalXXL}`,
    borderTop: '1px solid #E2E7EC',
    fontSize: '12px',
    color: '#5A7186',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    },
  },
});

const links = {
  portal: [
    { to: '/tenders', label: 'Open tenders' },
    { to: '/register', label: 'Register' },
    { to: '/login', label: 'Sign in' },
  ],
  resources: [
    { to: '/about', label: 'How it works' },
    { to: '/support', label: 'Vendor support' },
    { to: '/faq', label: 'FAQ' },
  ],
  legal: [
    { to: '/terms', label: 'Terms of use' },
    { to: '/privacy', label: 'Privacy policy' },
    { to: '/accessibility', label: 'Accessibility' },
  ],
};

export function Footer() {
  const styles = useStyles();
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.col}>
          <span className={styles.colTitle}>Tender Bid Portal</span>
          <p className={styles.meta}>
            A procurement portal for vendors to discover, register, and submit
            bids against public tenders. Built for transparency, fairness, and
            timely response.
          </p>
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>Portal</span>
          {links.portal.map((l) => (
            <AppLink key={l.to} to={l.to} className={styles.colLink}>
              {l.label}
            </AppLink>
          ))}
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>Resources</span>
          {links.resources.map((l) => (
            <AppLink key={l.to} to={l.to} className={styles.colLink}>
              {l.label}
            </AppLink>
          ))}
        </div>
        <div className={styles.col}>
          <span className={styles.colTitle}>Legal</span>
          {links.legal.map((l) => (
            <AppLink key={l.to} to={l.to} className={styles.colLink}>
              {l.label}
            </AppLink>
          ))}
        </div>
      </div>
      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} Tender Bid Portal. All rights reserved.</span>
        <span>ABN 00 000 000 000 · Procurement body demo</span>
      </div>
    </footer>
  );
}