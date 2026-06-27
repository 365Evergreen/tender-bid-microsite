/**
 * BidFormPage — the multi-step bid submission flow.
 *
 * Owns:
 *   - the react-hook-form instance for the whole bid
 *   - the step state (current + highest reached)
 *   - the local draft (for navigation between steps)
 *   - the API call to submit the bid
 *
 * Steps:
 *   1. Company details
 *   2. Primary contact
 *   3. Pricing
 *   4. Compliance
 *   5. Documents
 *   6. Review & submit
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { makeStyles, tokens, Button, MessageBar, MessageBarBody } from '@fluentui/react-components';
import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import type { z } from 'zod';

import { useTender } from '@/hooks/useTenders';
import { useBidDraft } from '@/hooks/useBidDraft';
import { useAuth } from '@/context/AuthContext';
import { createBid, submitBid } from '@/services/bids';
import { ApiClientError } from '@/services/api';
import { bidDraftSchema } from '@/utils/validation';
import { Loading } from '@/components/common/Loading';
import { BidStepIndicator } from '@/components/bid/BidStepIndicator';
import { CompanyStep } from '@/components/bid/CompanyStep';
import { ContactStep } from '@/components/bid/ContactStep';
import { PricingStep } from '@/components/bid/PricingStep';
import { ComplianceStep } from '@/components/bid/ComplianceStep';
import { DocumentsStep } from '@/components/bid/DocumentsStep';
import { ReviewStep } from '@/components/bid/ReviewStep';
import type { BidDocument } from '@/types';

/** Typed form values shared across all step components. */
export type BidFormValues = z.infer<typeof bidDraftSchema>;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '32px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
  },
  subtitle: {
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalL,
  },
  form: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalXL,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalXL,
    paddingTop: tokens.spacingVerticalL,
    borderTop: '1px solid #E2E7EC',
  },
  navRight: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export function BidFormPage() {
  const styles = useStyles();
  const { id: tenderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vendor } = useAuth();
  const { data: tender, isLoading: tenderLoading } = useTender(tenderId);
  const { draft, patch } = useBidDraft(tenderId ?? '');
  const [step, setStep] = useState<Step>(draft.currentStep);
  const [highestReached, setHighestReached] = useState<number>(draft.currentStep);
  const [documents, setDocuments] = useState<BidDocument[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<BidFormValues>({
    resolver: zodResolver(bidDraftSchema),
    defaultValues: {
      company: draft.company,
      contact: draft.contact,
      pricing: draft.pricing,
      compliance: {
        ...draft.compliance,
        // The zod schema requires these to be `true` literals, not `boolean`.
        acceptsTermsAndConditions: (draft.compliance.acceptsTermsAndConditions ?? false) as true,
        acceptsCodeOfConduct: (draft.compliance.acceptsCodeOfConduct ?? false) as true,
        insuranceVerified: (draft.compliance.insuranceVerified ?? false) as true,
      },
      proposal: draft.proposal ?? '',
    },
    mode: 'onTouched',
  });

  // Sync form → draft on every change (so localStorage reflects edits).
  methods.watch((value) => {
    if (!value || !tenderId) return;
    patch({
      tenderId,
      company: value.company as typeof draft.company,
      contact: value.contact as typeof draft.contact,
      pricing: value.pricing as typeof draft.pricing,
      compliance: value.compliance as typeof draft.compliance,
      proposal: (value.proposal as string) ?? '',
      currentStep: step,
      updatedAt: new Date().toISOString(),
    });
  });

  if (tenderLoading) return <Loading label="Loading tender…" />;
  if (!tender) return <div>Tender not found.</div>;

  const goToStep = (next: number) => {
    const clamped = Math.max(1, Math.min(6, next)) as Step;
    setStep(clamped);
    setHighestReached((h) => Math.max(h, clamped));
    patch({ currentStep: clamped, tenderId: tenderId ?? '', updatedAt: new Date().toISOString() });
  };

  const advance = async () => {
    let fields: (keyof BidFormValues)[] = [];
    switch (step) {
      case 1:
        fields = ['company'];
        break;
      case 2:
        fields = ['contact'];
        break;
      case 3:
        fields = ['pricing'];
        break;
      case 4:
        fields = ['compliance'];
        break;
      case 5:
        // Documents step has no validation; just advance.
        goToStep(step + 1);
        return;
      case 6:
        await handleSubmit();
        return;
    }
    const ok = await methods.trigger(fields as Parameters<typeof methods.trigger>[0]);
    if (ok) goToStep(step + 1);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const values = methods.getValues();
      const bid = await createBid({
        tenderId: tender.id,
        company: values.company as typeof draft.company,
        contact: values.contact as typeof draft.contact,
        pricing: values.pricing as typeof draft.pricing,
        compliance: values.compliance as typeof draft.compliance,
        documentIds: documents.map((d) => d.id),
        proposal: values.proposal as string,
      });
      const submitted = await submitBid(bid.id);
      navigate(`/tenders/${tender.id}/bid/confirmation/${submitted.id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.root}>
        <div>
          <h1 className={styles.title}>Bid submission</h1>
          <p className={styles.subtitle}>
            <strong>{tender.reference}</strong> — {tender.title}
          </p>
        </div>

        <BidStepIndicator
          currentStep={step}
          highestStepReached={highestReached}
          onStepClick={(n) => goToStep(n)}
        />

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {submitError && (
            <MessageBar intent="error" style={{ marginBottom: '16px' }}>
              <MessageBarBody>{submitError}</MessageBarBody>
            </MessageBar>
          )}

          {step === 1 && <CompanyStep initialCompany={vendor?.company} />}
          {step === 2 && <ContactStep initialContact={vendor?.contact} />}
          {step === 3 && <PricingStep />}
          {step === 4 && <ComplianceStep />}
          {step === 5 && (
            <DocumentsStep
              requirements={tender.documentRequirements}
              documents={documents}
              onDocumentsChange={setDocuments}
            />
          )}
          {step === 6 && <ReviewStep draft={draft} documents={documents} />}

          <div className={styles.nav}>
            <Button
              appearance="subtle"
              icon={<ChevronLeft20Regular />}
              disabled={step === 1 || submitting}
              onClick={() => goToStep(step - 1)}
            >
              Back
            </Button>
            <div className={styles.navRight}>
              <Button appearance="subtle" onClick={() => navigate(`/tenders/${tender.id}`)}>
                Cancel
              </Button>
              {step < 6 && (
                <Button
                  type="button"
                  appearance="primary"
                  icon={<ChevronRight20Regular />}
                  iconPosition="after"
                  onClick={advance}
                  disabled={submitting}
                >
                  Continue
                </Button>
              )}
              {step === 6 && (
                <Button
                  type="button"
                  appearance="primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit bid'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}