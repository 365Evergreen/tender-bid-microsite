/**
 * Bid step 3: Pricing.
 *
 * Line items, currency, tax rate. Subtotal/tax/total are computed and
 * shown in a sticky-style summary panel on the right.
 */

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  makeStyles,
  tokens,
  Input,
  Field,
  Button,
  Select,
  Divider,
} from '@fluentui/react-components';
import { Add20Regular, Delete20Regular } from '@fluentui/react-icons';

import { formatCurrency } from '@/utils/format';
import type { BidFormValues } from '@/pages/BidFormPage';
import type { BidLineItem } from '@/types';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: tokens.spacingHorizontalXL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  lineItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  lineItemRow: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 1fr auto',
    gap: tokens.spacingVerticalS,
    alignItems: 'end',
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: '1px dashed #E2E7EC',
  },
  lineItemRowMobile: {
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  controls: {
    display: 'flex',
    alignItems: 'end',
    gap: tokens.spacingVerticalS,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    height: 'fit-content',
    position: 'sticky',
    top: tokens.spacingVerticalL,
  },
  summaryTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalM,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} 0`,
    fontSize: '14px',
    color: '#26405A',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} 0`,
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1A2B3C',
    borderTop: '2px solid #1A2B3C',
    marginTop: tokens.spacingVerticalS,
  },
  summaryTotalValue: {
    color: '#B8860B',
  },
});

const CURRENCIES = [
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — Pound Sterling' },
  { value: 'NZD', label: 'NZD — New Zealand Dollar' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
];

export function PricingStep() {
  const styles = useStyles();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BidFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'pricing.lineItems' });

  const watched = useWatch({ control, name: 'pricing' });
  const lineItems = (watched?.lineItems ?? []) as BidLineItem[];
  const currency = watched?.currency ?? 'AUD';
  const taxRate = watched?.taxRate ?? 0;

  const subtotal = lineItems.reduce(
    (acc: number, item: BidLineItem) =>
      acc + (Number(item.quantity) || 0) * (Number(item.unitPrice.amount) || 0),
    0,
  );
  const taxAmount = Math.round(subtotal * Number(taxRate));
  const total = subtotal + taxAmount;

  return (
    <div className={styles.root}>
      <div>
        <Field
          label="Currency"
          required
          validationState={errors.pricing?.currency ? 'error' : undefined}
          validationMessage={errors.pricing?.currency?.message as string}
        >
          <Select {...register('pricing.currency')}>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Divider />

        <h3
          style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: '16px',
            fontWeight: 600,
            color: '#1A2B3C',
            marginBottom: '12px',
          }}
        >
          Line items
        </h3>

        <div className={styles.lineItems}>
          {fields.map((field, idx) => (
            <div key={field.id} className={styles.lineItemRow}>
              <Field
                label="Description"
                validationState={
                  errors.pricing?.lineItems?.[idx]?.description ? 'error' : undefined
                }
                validationMessage={
                  errors.pricing?.lineItems?.[idx]?.description?.message as string
                }
              >
                <Input {...register(`pricing.lineItems.${idx}.description` as const)} />
              </Field>

              <Field
                label="Qty"
                validationState={
                  errors.pricing?.lineItems?.[idx]?.quantity ? 'error' : undefined
                }
              >
                <Input
                  type="number"
                  step="1"
                  min="1"
                  {...register(`pricing.lineItems.${idx}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Field
                label={`Unit price (${currency})`}
                validationState={
                  errors.pricing?.lineItems?.[idx]?.unitPrice?.amount ? 'error' : undefined
                }
              >
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`pricing.lineItems.${idx}.unitPrice.amount` as const, {
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                aria-label={`Remove line item ${idx + 1}`}
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
              />
            </div>
          ))}

          <Button
            appearance="subtle"
            icon={<Add20Regular />}
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                description: '',
                quantity: 1,
                unitPrice: { amount: 0, currency },
              })
            }
          >
            Add line item
          </Button>
        </div>

        <Divider />

        <Field
          label="Tax rate (0.1 = 10%)"
          required
          validationState={errors.pricing?.taxRate ? 'error' : undefined}
          validationMessage={errors.pricing?.taxRate?.message as string}
        >
          <Input
            type="number"
            step="0.001"
            min="0"
            max="1"
            {...register('pricing.taxRate', { valueAsNumber: true })}
          />
        </Field>
      </div>

      <aside className={styles.summary}>
        <div className={styles.summaryTitle}>Bid summary</div>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tax ({(Number(taxRate) * 100).toFixed(1)}%)</span>
          <span>{formatCurrency(taxAmount, currency)}</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span className={styles.summaryTotalValue}>{formatCurrency(total, currency)}</span>
        </div>
      </aside>
    </div>
  );
}