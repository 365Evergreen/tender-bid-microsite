/**
 * RegisterPage — vendor registration.
 *
 * Captures the minimum to create a vendor account. Company + contact
 * details get filled in (or refreshed) on the first bid's step 1.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  makeStyles,
  tokens,
  Input,
  Field,
  Checkbox,
  Button,
  Link,
} from '@fluentui/react-components';
import { z } from 'zod';

import { useAuth } from '@/context/AuthContext';
import { ApiClientError } from '@/services/api';
import { registerSchema } from '@/utils/validation';

const useStyles = makeStyles({
  root: {
    maxWidth: '480px',
    margin: '0 auto',
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '32px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalS,
  },
  subtitle: {
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalXL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalXL,
  },
  alert: {
    backgroundColor: '#FCE4E4',
    color: '#8B2635',
    padding: tokens.spacingVerticalM,
    borderRadius: '4px',
    fontSize: '13px',
  },
  footer: {
    marginTop: tokens.spacingVerticalL,
    textAlign: 'center',
    color: '#5A7186',
    fontSize: '13px',
  },
});

export function RegisterPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { register: registerVendor } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await registerVendor({
        email: data.email,
        password: data.password,
        // Company + contact will be completed during the first bid; we
        // record minimum placeholder values so the auth shape is valid.
        company: {
          legalName: '',
          registrationNumber: '',
          registeredAddress: {
            line1: '',
            city: '',
            region: '',
            postcode: '',
            country: '',
          },
        },
        contact: {
          fullName: '',
          role: '',
          email: data.email,
          phone: '',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Registration failed. Please try again.');
      }
    }
  });

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Register as a vendor</h1>
      <p className={styles.subtitle}>
        Create an account to start submitting bids against open tenders.
      </p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {submitError && <div className={styles.alert}>{submitError}</div>}

        <Field
          label="Email address"
          required
          validationState={errors.email ? 'error' : undefined}
          validationMessage={errors.email?.message as string}
        >
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>

        <Field
          label="Password"
          hint="At least 10 characters, with an uppercase letter and a number."
          required
          validationState={errors.password ? 'error' : undefined}
          validationMessage={errors.password?.message as string}
        >
          <Input
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
        </Field>

        <Field
          label="Confirm password"
          required
          validationState={errors.confirmPassword ? 'error' : undefined}
          validationMessage={errors.confirmPassword?.message as string}
        >
          <Input
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </Field>

        <Field
          validationState={errors.acceptTerms ? 'error' : undefined}
          validationMessage={errors.acceptTerms?.message as string}
        >
          <Checkbox
            label="I accept the terms and conditions and privacy policy"
            {...register('acceptTerms')}
          />
        </Field>

        <Button
          type="submit"
          appearance="primary"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>

        <div className={styles.footer}>
          Already registered?{' '}
          <Link href="/login">Sign in instead</Link>
        </div>
      </form>
    </div>
  );
}