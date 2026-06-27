/**
 * NavButton — Fluent UI Button styled as a navigation link.
 *
 * Use this anywhere you need a Button (with appearance, size, icon) that
 * navigates to a React Router route. Avoids the Fluent UI `as` prop + `to`
 * typing clash by using `onClick` + `useNavigate` internally.
 */

import type { MouseEvent, ReactNode } from 'react';
import { Button, type ButtonProps } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';

export interface NavButtonProps extends Omit<ButtonProps, 'as' | 'href' | 'onClick'> {
  /** React Router path to navigate to. */
  to: string;
  /** Optional additional onClick handler (called before navigation). */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

export function NavButton({ to, onClick, children, type, ...rest }: NavButtonProps) {
  const navigate = useNavigate();
  return (
    // The `rest as any` cast bypasses the polymorphic-union type narrowing
    // for `as` — Fluent UI v9's ButtonProps is a discriminated union on `as`,
    // and spreading `rest` can re-widen it. `as="button"` narrows onClick.
    <Button
      as="button"
      {...(rest as any)}
      type={type ?? 'button'}
      onClick={(e) => {
        onClick?.(e);
        navigate(to);
      }}
    >
      {children}
    </Button>
  );
}