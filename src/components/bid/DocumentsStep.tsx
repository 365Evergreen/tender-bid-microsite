/**
 * Bid step 5: Document uploads.
 *
 * Each tender requirement gets its own upload zone. The parent tracks the
 * flat list of all uploaded documents (the union across requirements) via
 * `onDocumentsChange`. This component is responsible for per-requirement
 * state and surfacing new uploads upward.
 */

import { useCallback, useState } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

import { DocumentUpload } from '@/components/upload/DocumentUpload';
import type { BidDocument, DocumentKind, TenderDocumentRequirement } from '@/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  requirement: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
  },
  requirementHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalS,
  },
  requirementTitle: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1A2B3C',
  },
  requirementBadge: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#B8860B',
    fontWeight: 600,
  },
  requirementDescription: {
    color: '#5A7186',
    fontSize: '13px',
    marginBottom: tokens.spacingVerticalM,
    lineHeight: 1.5,
  },
});

export interface DocumentsStepProps {
  requirements: TenderDocumentRequirement[];
  /** All documents uploaded across all requirements. */
  documents: BidDocument[];
  onDocumentsChange: (docs: BidDocument[]) => void;
}

export function DocumentsStep({
  requirements,
  documents,
  onDocumentsChange,
}: DocumentsStepProps) {
  const styles = useStyles();

  // Track which docs belong to which requirement locally. On every change
  // we recompute the flat list and notify the parent.
  const [byRequirement, setByRequirement] = useState<Record<string, BidDocument[]>>({});

  const handleRequirementChange = useCallback(
    (reqId: string, docs: BidDocument[]) => {
      const next = { ...byRequirement, [reqId]: docs };
      setByRequirement(next);
      onDocumentsChange(Object.values(next).flat());
    },
    [byRequirement, onDocumentsChange],
  );

  // Sync the parent-provided docs back into our local map when the parent
  // resets the list (e.g. on draft load).
  if (documents.length === 0 && Object.keys(byRequirement).length > 0) {
    setByRequirement({});
  }

  return (
    <div className={styles.root}>
      {requirements.length === 0 && (
        <p style={{ color: '#5A7186' }}>
          This tender does not require any supporting documents. You can proceed
          to the review step.
        </p>
      )}

      {requirements.map((req) => (
        <div key={req.id} className={styles.requirement}>
          <div className={styles.requirementHeader}>
            <span className={styles.requirementTitle}>{req.name}</span>
            {req.required && <span className={styles.requirementBadge}>Required</span>}
          </div>
          <p className={styles.requirementDescription}>{req.description}</p>
          <DocumentUpload
            kind={mapRequirementToKind(req.name)}
            accept={req.acceptedTypes.join(',')}
            maxSizeMB={req.maxSizeMB}
            initialDocuments={byRequirement[req.id] ?? []}
            onDocumentsChange={(docs) => handleRequirementChange(req.id, docs)}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Heuristic: map a requirement name to a document-kind value. Real systems
 * would persist the kind explicitly per requirement.
 */
function mapRequirementToKind(name: string): DocumentKind {
  const lower = name.toLowerCase();
  if (lower.includes('insurance')) return 'insurance_certificate';
  if (lower.includes('financial')) return 'financial_statement';
  if (lower.includes('company') || lower.includes('capability')) return 'company_profile';
  if (lower.includes('technical') || lower.includes('proposal')) return 'technical_proposal';
  if (lower.includes('pricing')) return 'technical_proposal';
  if (lower.includes('irap') || lower.includes('compliance')) return 'compliance_certificate';
  return 'other';
}