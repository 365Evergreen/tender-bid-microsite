/**
 * Bid step 2: Primary contact.
 */

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { makeStyles, tokens, Input, Field } from '@fluentui/react-components';

import type { BidFormValues } from '@/pages/BidFormPage';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  hint: {
    gridColumn: '1 / -1',
    color: '#5A7186',
    fontSize: '13px',
    marginBottom: tokens.spacingVerticalS,
  },
});

export interface ContactStepProps {
  initialContact?: import('@/types').VendorContact;
}

export function ContactStep({ initialContact }: ContactStepProps) {
  const styles = useStyles();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<BidFormValues>();

  useEffect(() => {
        if (initialContact) {
          Object.entries(initialContact).forEach(([key, value]) => {
            if (value) setValue(`contact.${key}` as any, value as any);
          });
        }
      }, [initialContact, setValue]);

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        The primary contact receives all clarifications and notifications
        about this bid.
      </p>

      <Field
        label="Full name"
        required
        validationState={errors.contact?.fullName ? 'error' : undefined}
        validationMessage={errors.contact?.fullName?.message as string}
      >
        <Input {...register('contact.fullName')} />
      </Field>

      <Field
        label="Role / job title"
        required
        validationState={errors.contact?.role ? 'error' : undefined}
        validationMessage={errors.contact?.role?.message as string}
      >
        <Input {...register('contact.role')} />
      </Field>

      <Field
        label="Email"
        required
        validationState={errors.contact?.email ? 'error' : undefined}
        validationMessage={errors.contact?.email?.message as string}
      >
        <Input type="email" {...register('contact.email')} />
      </Field>

      <Field
        label="Phone"
        required
        validationState={errors.contact?.phone ? 'error' : undefined}
        validationMessage={errors.contact?.phone?.message as string}
      >
        <Input type="tel" {...register('contact.phone')} />
      </Field>
    </div>
  );
}