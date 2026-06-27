/**
 * EmptyState — for "no results" / "no tenders" / etc.
 */

import { makeStyles, tokens } from '@fluentui/react-components';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalL}`,
    border: '1px dashed #C5D0DA',
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
  },
  description: {
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalL,
  },
});

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}