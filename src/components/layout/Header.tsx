/**
 * Site header — branding, primary nav, account menu.
 *
 * Distinctive editorial header: serif wordmark left, sans nav centre,
 * account menu right. Bottom rule (deep slate, 1px) separates from content.
 * The accent gold is reserved for active state and the wordmark.
 */

import {
    makeStyles,
    tokens,
    Button,
    Avatar,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    MenuDivider,
  } from '@fluentui/react-components';
  import { ChevronDown20Regular, SignOut20Regular } from '@fluentui/react-icons';
  import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';

  import { AppLink } from '@/components/common/AppLink';
  import { NavButton } from '@/components/common/NavButton';

import { useAuth } from '@/context/AuthContext';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#FAF7F2',
    borderBottom: '1px solid #26405A',
  },
  inner: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    '@media (max-width: 768px)': {
      padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    },
  },
  brand: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '22px',
    fontWeight: 600,
    color: '#1A2B3C',
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  brandMark: {
    color: '#B8860B',
    fontStyle: 'italic',
  },
  nav: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    flex: 1,
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navLink: {
    color: '#26405A',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: `${tokens.spacingVerticalXS} 0`,
    borderBottom: '2px solid transparent',
    transition: 'border-color 120ms ease',
    '&:hover': {
      borderBottomColor: '#B8860B',
    },
  },
  navLinkActive: {
    borderBottomColor: '#B8860B',
    color: '#1A2B3C',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

const navItems = [
  { to: '/tenders', label: 'Open Tenders' },
  { to: '/about', label: 'How It Works' },
  { to: '/support', label: 'Support' },
];

export function Header() {
  const styles = useStyles();
  const { vendor, status, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <RouterLink to={"/" as any} className={styles.brand}>
          <span className={styles.brandMark}>T.</span> Tender Bid Portal
        </RouterLink>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {status === 'authenticated' && vendor ? (
            <Menu>
              <MenuTrigger>
                <Button
                  appearance="subtle"
                  icon={<Avatar name={vendor.contact.fullName} size={24} color="brand" />}
                  iconPosition="before"
                >
                  {vendor.contact.fullName}
                  <ChevronDown20Regular />
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => navigate('/dashboard')}>My dashboard</MenuItem>
                  <MenuItem onClick={() => navigate('/dashboard/bids')}>My bids</MenuItem>
                  <MenuItem onClick={() => navigate('/dashboard/profile')}>Company profile</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<SignOut20Regular />} onClick={handleLogout}>
                    Sign out
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          ) : (
            <>
                            <AppLink to="/login" appearance="subtle">
                              Sign in
                            </AppLink>
                            <NavButton to="/register" appearance="primary">
                              Register as vendor
                            </NavButton>
                          </>
          )}
        </div>
      </div>
    </header>
  );
}