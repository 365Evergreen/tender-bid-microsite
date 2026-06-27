/**
 * LoginPage — vendor sign in.
 *
 * Demo credentials shown below the form so reviewers can sign in without
 * registering. In production this hint would be removed.
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
  Button,
  Link,
} from '@fluentui/react-components';

import { useAuth } from '@/context/AuthContext';
import { ApiClientError } from '@/services/api';
import { loginSchema } from '@/utils/validation';

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
  demo: {
    marginTop: tokens.spacingVerticalXL,
    padding: tokens.spacingVerticalM,
    backgroundColor: '#FCF6E6',
    border: '1px solid #E5BC55',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#704D05',
    lineHeight: 1.6,
  },
});

export function LoginPage() {
  const styles = useStyles();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<import('@/utils/validation').LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Sign in failed. Please try again.');
      }
    }
  });

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Sign in</h1>
      <p className={styles.subtitle}>Sign in to manage your bids and profile.</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {submitError && <div className={styles.alert}>{submitError}</div>}

        <Field
          label="Email"
          required
          validationState={errors.email ? 'error' : undefined}
          validationMessage={errors.email?.message as string}
        >
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>

        <Field
          label="Password"
          required
          validationState={errors.password ? 'error' : undefined}
          validationMessage={errors.password?.message as string}
        >
          <Input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </Field>

        <Button
          type="submit"
          appearance="primary"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className={styles.footer}>
          New vendor?{' '}
          <Link href="/register">Register as a vendor</Link>
        </div>
      </form>

      <div className={styles.demo}>
        <strong>Demo credentials (MSW only):</strong>
        <br />
        Email: <code>demo@aurelia.eng.au</code>
        <br />
        Password: <code>Demo1234!</code>
      </div>
    </div>
  );
}