/**
 * ErrorBoundary — top-level catch.
 *
 * Reports the error to the console and shows a polite fallback. The
 * fallback explains what happened and offers a reload. In production
 * this would integrate with an error-reporting service.
 */

import { Component, type ReactNode } from 'react';
import { makeStyles, tokens, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalL}`,
    maxWidth: '560px',
    margin: '0 auto',
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '24px',
    fontWeight: 600,
    color: '#8B2635',
    marginBottom: tokens.spacingVerticalS,
  },
  message: {
    color: '#26405A',
    marginBottom: tokens.spacingVerticalL,
    lineHeight: 1.6,
  },
  detail: {
    fontFamily: 'monospace',
    backgroundColor: '#F4F6F8',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalM,
    fontSize: '12px',
    color: '#26405A',
    textAlign: 'left',
    overflow: 'auto',
    marginBottom: tokens.spacingVerticalL,
  },
});

interface State {
  error?: Error;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    // Production: ship to error-reporting service.
    console.error('[App Error]', error);
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return <ErrorFallback error={this.state.error} />;
  }
}

function ErrorFallback({ error }: { error: Error }) {
  const styles = useStyles();
  const reload = () => window.location.reload();
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.message}>
        The portal hit an unexpected error. The detail below has been logged —
        try reloading the page. If the problem persists, contact support.
      </p>
      <pre className={styles.detail}>{error.message}</pre>
      <Button appearance="primary" onClick={reload}>
        Reload page
      </Button>
    </div>
  );
}