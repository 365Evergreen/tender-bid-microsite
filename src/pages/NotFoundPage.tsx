/**
 * NotFoundPage — 404.
 */

import { makeStyles, tokens } from '@fluentui/react-components';

import { NavButton } from '@/components/common/NavButton';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    padding: `${tokens.spacingVerticalXXL} 0`,
    maxWidth: '520px',
    margin: '0 auto',
  },
  code: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '96px',
    color: '#B8860B',
    fontWeight: 600,
    lineHeight: 1,
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '28px',
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalS,
  },
  desc: {
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalXL,
    lineHeight: 1.6,
  },
});

export function NotFoundPage() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.desc}>
        The page you were looking for doesn't exist or has been moved. Try one
        of the destinations below.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <NavButton appearance="primary" to="/">
                  Home
                </NavButton>
                <NavButton appearance="subtle" to="/tenders">
                  Open tenders
                </NavButton>
              </div>
    </div>
  );
}