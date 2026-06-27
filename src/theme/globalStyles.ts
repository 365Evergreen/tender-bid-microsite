/**
 * Global styles — applied once at app root.
 *
 * Sets typography defaults so Fluent UI components inherit the editorial
 * character (serif display, sans body) without needing per-component overrides.
 */

import { makeStyles, tokens } from '@fluentui/react-components';

export const useGlobalStyles = makeStyles({
  root: {
    fontFamily: tokens.fontFamilyBase,
    backgroundColor: '#FAF7F2', // parchment
    color: '#1A2B3C',
    minHeight: '100vh',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  display: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
});

/** Inject as a string at root — keeps critical CSS colocated. */
export const globalStylesheet = `
  body {
    margin: 0;
    background: #FAF7F2;
    color: #1A2B3C;
  }
  h1, h2, h3, h4, h5, h6, .fluentui-display {
    font-family: "Fraunces", Georgia, serif;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  ::selection {
    background: ${accentFor('60')};
    color: #FAF7F2;
  }
`;

function accentFor(shade: '60'): string {
  return shade === '60' ? '#B8860B' : '#1A2B3C';
}