/**
 * AppShell — the outer layout chrome shared by every page.
 *
 * Slots:
 *   - <Header /> at top
 *   - <Outlet /> for the routed page content
 *   - <Footer /> at bottom
 *
 * Background is parchment (set in globalStylesheet). Content has max-width
 * 1200px, generous side padding.
 */

import { makeStyles, tokens } from '@fluentui/react-components';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Footer } from './Footer';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
  },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    },
  },
});

export function AppShell() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}