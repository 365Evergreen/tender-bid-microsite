/**
 * AppLink — Fluent UI Link + React Router integration.
 *
 * Fluent UI v9's Link component has a narrow `as` prop type (`'span' | 'a' | 'button'`),
 * so passing React Router's `<Link>` directly triggers TypeScript errors. This wrapper
 * accepts a `to` prop and renders Fluent's styled anchor with proper SPA navigation.
 */

import type { ReactNode } from 'react';
import { Link as FluentLink, type LinkProps } from '@fluentui/react-components';
import { Link as RouterLink } from 'react-router-dom';

export interface AppLinkProps extends Omit<LinkProps, 'as' | 'href'> {
  /** React Router path. */
  to: string;
  children: ReactNode;
}

export function AppLink({ to, children, ...rest }: AppLinkProps) {
  // The `as any` + `to` cast bypass Fluent's narrow `as` prop typing.
  // The runtime is fully polymorphic — this is purely a TS workaround.
  return (
    <FluentLink {...rest} {...({ as: RouterLink as any, to } as any)}>
      {children}
    </FluentLink>
  );
}