/**
 * DocumentUpload — orchestrates dropzone + per-file progress + completed list.
 *
 * Wraps `useFileUpload` so the parent doesn't need to. Renders the dropzone
 * for new files, then the list of in-flight and completed uploads below.
 */

import { useEffect, useState } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

import { FileDropZone } from './FileDropZone';
import { UploadedDocumentRow } from './UploadedDocumentRow';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { BidDocument, DocumentKind } from '@/types';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  kindPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    fontSize: '13px',
    color: '#5A7186',
  },
});

export interface DocumentUploadProps {
  /** Pre-existing documents (e.g. when editing an already-attached doc). */
  initialDocuments?: BidDocument[];
  /** Document kind for any new uploads. */
  kind: DocumentKind;
  accept?: string;
  maxSizeMB?: number;
  /** Bid ID (once a draft bid exists). */
  bidId?: string;
  /** Called whenever the uploaded-document list changes. */
  onDocumentsChange: (docs: BidDocument[]) => void;
}

export function DocumentUpload({
  initialDocuments = [],
  kind,
  accept,
  maxSizeMB = 100,
  bidId,
  onDocumentsChange,
}: DocumentUploadProps) {
  const styles = useStyles();
  const { uploads, upload } = useFileUpload();
  const [documents, setDocuments] = useState<BidDocument[]>(initialDocuments);

  // Notify parent when the list changes.
  useEffect(() => {
    onDocumentsChange(documents);
  }, [documents, onDocumentsChange]);

  const handleFiles = async (files: File[]) => {
    const settled: BidDocument[] = [];
    for (const file of files) {
      try {
        const { document } = await upload({ file, kind, bidId });
        settled.push(document);
      } catch {
        /* error already surfaced via UploadProgress */
      }
    }
    if (settled.length > 0) {
      setDocuments((prev) => [...prev, ...settled]);
    }
  };

  const handleDelete = (doc: BidDocument) => {
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  return (
    <div className={styles.root}>
      <FileDropZone
        accept={accept}
        maxSizeMB={maxSizeMB}
        onFiles={handleFiles}
        hint={`Max file size ${maxSizeMB} MB. Accepted formats: ${accept ?? 'any'}.`}
      />

      {(documents.length > 0 || uploads.length > 0) && (
        <div className={styles.list}>
          {uploads.map((u) => (
            <UploadedDocumentRow key={u.documentId} progress={u} />
          ))}
          {documents.map((d) => (
            <UploadedDocumentRow
              key={d.id}
              document={d}
              onDelete={() => handleDelete(d)}
            />
          ))}
        </div>
      )}
    </div>
  );
}