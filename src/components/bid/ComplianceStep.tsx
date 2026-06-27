/**
 * Bid step 4: Compliance declarations.
 */

import { useFormContext } from 'react-hook-form';
import {
  makeStyles,
  tokens,
  Checkbox,
  Field,
  Input,
  Textarea,
} from '@fluentui/react-components';

import type { BidFormValues } from '@/pages/BidFormPage';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  block: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
  },
  blockTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalS,
  },
  blockHint: {
    color: '#5A7186',
    fontSize: '13px',
    marginBottom: tokens.spacingVerticalM,
    lineHeight: 1.5,
  },
});

export function ComplianceStep() {
  const styles = useStyles();
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BidFormValues>();

  const hasConflict = watch('compliance.conflictOfInterestDeclared');

  return (
    <div className={styles.root}>
      <div className={styles.block}>
        <div className={styles.blockTitle}>Conflict of interest</div>
        <p className={styles.blockHint}>
          Vendors must declare any actual, potential, or perceived conflict of
          interest with the procurement body or any party involved in this
          tender. If unsure, declare — silence is treated as a conflict.
        </p>
        <Field>
          <Checkbox
            label="I declare a conflict of interest (real, potential, or perceived)"
            {...register('compliance.conflictOfInterestDeclared')}
          />
        </Field>
        {hasConflict && (
          <Field
            label="Describe the conflict"
            required
            validationState={errors.compliance?.conflictOfInterestDetails ? 'error' : undefined}
            validationMessage={errors.compliance?.conflictOfInterestDetails?.message as string}
          >
            <Textarea
              rows={4}
              {...register('compliance.conflictOfInterestDetails')}
            />
          </Field>
        )}
      </div>

      <div className={styles.block}>
        <div className={styles.blockTitle}>Insurance</div>
        <p className={styles.blockHint}>
          Confirm that your organisation holds valid public liability and
          professional indemnity insurance at the levels specified in the
          tender conditions.
        </p>
        <Field
          validationState={errors.compliance?.insuranceVerified ? 'error' : undefined}
          validationMessage={errors.compliance?.insuranceVerified?.message as string}
        >
          <Checkbox
            label="I confirm valid insurance is held at the required levels"
            {...register('compliance.insuranceVerified')}
          />
        </Field>
        <Field label="Insurance expiry date (YYYY-MM-DD)" hint="Required to confirm cover through contract end">
          <Input type="date" {...register('compliance.insuranceExpiryDate')} />
        </Field>
      </div>

      <div className={styles.block}>
        <div className={styles.blockTitle}>Acceptances</div>
        <Field
          validationState={errors.compliance?.acceptsTermsAndConditions ? 'error' : undefined}
          validationMessage={errors.compliance?.acceptsTermsAndConditions?.message as string}
        >
          <Checkbox
            label="I accept the tender's terms and conditions"
            {...register('compliance.acceptsTermsAndConditions')}
          />
        </Field>
        <Field
          validationState={errors.compliance?.acceptsCodeOfConduct ? 'error' : undefined}
          validationMessage={errors.compliance?.acceptsCodeOfConduct?.message as string}
        >
          <Checkbox
            label="I will abide by the procurement code of conduct"
            {...register('compliance.acceptsCodeOfConduct')}
          />
        </Field>
      </div>
    </div>
  );
}