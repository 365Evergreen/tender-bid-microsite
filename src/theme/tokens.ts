/**
 * Editorial / document-inspired theme tokens.
 *
 * Built on Fluent UI v9's design-token architecture but customised so the
 * portal reads as "serious procurement document" rather than "generic SaaS".
 *
 * Palette intent:
 *   - Deep slate primary (#1A2B3C) — institutional, authoritative
 *   - Warm gold accent (#B8860B) — value, attention, importance
 *   - Parchment background (#FAF7F2) — paper-feel, off the sterile white
 *   - Burgundy error (#8B2635) — formalised failure
 *   - Forest success (#2D5A3D) — formalised confirmation
 */

import {
  createLightTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

/** Brand ramp — primary ramp drives all primary tokens. */
export const brand: BrandVariants = {
  10: '#F4F6F8',
  20: '#E2E7EC',
  30: '#C5D0DA',
  40: '#9EAEC0',
  50: '#7B8FA3',
  60: '#5A7186',
  70: '#3D556B',
  80: '#26405A',
  90: '#1A2B3C', // primary brand
  100: '#0F1B28',
  110: '#06101A',
  120: '#02080E',
  130: '#000406',
  140: '#000204',
  150: '#000102',
  160: '#000000',
};

/** Accent (gold) ramp — used sparingly for emphasis, totals, key actions. */
export const accent: BrandVariants = {
  10: '#FCF6E6',
  20: '#F7E9C2',
  30: '#F0D58F',
  40: '#E5BC55',
  50: '#D2A330',
  60: '#B8860B', // accent brand
  70: '#946808',
  80: '#704D05',
  90: '#523803',
  100: '#382602',
  110: '#241801',
  120: '#140D00',
  130: '#080500',
  140: '#040200',
  150: '#020100',
  160: '#000000',
};

export const baseTheme: Theme = createLightTheme(brand);

/** Custom theme — extends Fluent's light theme with editorial tokens. */
export const theme: Theme = {
  ...baseTheme,
  // Override fonts. Display = Fraunces (serif), body = Inter Tight.
  fontFamilyBase: '"Inter Tight", system-ui, -apple-system, sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
  fontSizeBase100: '14px', // Fluent's base font size token (string in v9)
  // Restrained radius — formal documents don't shout.
  borderRadiusSmall: '2px',
  borderRadiusMedium: '4px',
  borderRadiusLarge: '6px',
};