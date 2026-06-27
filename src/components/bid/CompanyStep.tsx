/**
 * Bid step 1: Company details.
 *
 * Captures legal entity, registration number, and registered address.
 * Pre-fills from the authenticated vendor's profile if available.
 */

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  makeStyles,
  tokens,
  Input,
  Field,
} from '@fluentui/react-components';

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
  fullRow: {
    gridColumn: '1 / -1',
  },
  sectionTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalS,
    gridColumn: '1 / -1',
    borderBottom: '1px solid #E2E7EC',
    paddingBottom: tokens.spacingVerticalXS,
  },
});

export interface CompanyStepProps {
  /** Pre-fill from vendor's profile on mount. */
  initialCompany?: import('@/types').VendorCompany;
}

export function CompanyStep({ initialCompany }: CompanyStepProps) {
  const styles = useStyles();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<BidFormValues>();

  useEffect(() => {
        if (initialCompany) {
          Object.entries(initialCompany).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              setValue(`company.${key}` as any, value as any);
            }
          });
        }
      }, [initialCompany, setValue]);

  const addressPath = (field: string) => `company.registeredAddress.${field}` as any;

  return (
    <div className={styles.root}>
      <h3 className={styles.sectionTitle}>Legal entity</h3>

      <Field
        label="Legal name"
        required
        validationState={errors.company?.legalName ? 'error' : undefined}
        validationMessage={errors.company?.legalName?.message as string}
      >
        <Input {...register('company.legalName')} />
      </Field>

      <Field
        label="Trading name (if different)"
        validationState={errors.company?.tradingName ? 'error' : undefined}
      >
        <Input {...register('company.tradingName')} />
      </Field>

      <Field
        label="Company registration number (ABN / ACN / EIN)"
        required
        validationState={errors.company?.registrationNumber ? 'error' : undefined}
        validationMessage={errors.company?.registrationNumber?.message as string}
      >
        <Input {...register('company.registrationNumber')} />
      </Field>

      <Field label="Tax ID" validationState={errors.company?.taxId ? 'error' : undefined}>
        <Input {...register('company.taxId')} />
      </Field>

      <Field label="Industry" validationState={errors.company?.industry ? 'error' : undefined}>
        <Input {...register('company.industry')} />
      </Field>

      <Field
        label="Years trading"
        validationState={errors.company?.yearsTrading ? 'error' : undefined}
      >
        <Input type="number" {...register('company.yearsTrading')} />
      </Field>

      <h3 className={styles.sectionTitle}>Registered address</h3>

      <div className={styles.fullRow}>
        <Field
          label="Address line 1"
          required
          validationState={errors.company?.registeredAddress?.line1 ? 'error' : undefined}
          validationMessage={errors.company?.registeredAddress?.line1?.message as string}
        >
          <Input {...register(addressPath('line1'))} />
        </Field>
      </div>

      <div className={styles.fullRow}>
        <Field label="Address line 2">
          <Input {...register(addressPath('line2'))} />
        </Field>
      </div>

      <Field
        label="City"
        required
        validationState={errors.company?.registeredAddress?.city ? 'error' : undefined}
        validationMessage={errors.company?.registeredAddress?.city?.message as string}
      >
        <Input {...register(addressPath('city'))} />
      </Field>

      <Field
        label="Region / state"
        required
        validationState={errors.company?.registeredAddress?.region ? 'error' : undefined}
        validationMessage={errors.company?.registeredAddress?.region?.message as string}
      >
        <Input {...register(addressPath('region'))} />
      </Field>

      <Field
        label="Postcode"
        required
        validationState={errors.company?.registeredAddress?.postcode ? 'error' : undefined}
        validationMessage={errors.company?.registeredAddress?.postcode?.message as string}
      >
        <Input {...register(addressPath('postcode'))} />
      </Field>

      <Field
        label="Country"
        required
        validationState={errors.company?.registeredAddress?.country ? 'error' : undefined}
        validationMessage={errors.company?.registeredAddress?.country?.message as string}
      >
        <Input {...register(addressPath('country'))} />
      </Field>
    </div>
  );
}