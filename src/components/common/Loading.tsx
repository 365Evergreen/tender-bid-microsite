/**
 * Loading — page-level spinner wrapper.
 */

import { makeStyles, Spinner, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${tokens.spacingVerticalXXL} 0`,
    gap: tokens.spacingVerticalM,
    color: '#5A7186',
  },
  label: {
    fontSize: '14px',
  },
});

export function Loading({ label = 'Loading…' }: { label?: string }) {
  const styles = useStyles();
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <Spinner size="medium" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}