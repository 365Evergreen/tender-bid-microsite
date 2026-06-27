/**
 * UploadedDocumentRow — single document with progress / status / actions.
 *
 * Shows per-file progress while uploading, then the canonical BidDocument
 * once complete. Provides a delete action.
 */

import { makeStyles, tokens, ProgressBar, Button, Badge } from '@fluentui/react-components';
import { Document20Regular, Delete20Regular } from '@fluentui/react-icons';

import type { BidDocument, UploadProgress } from '@/types';
import { formatFileSize } from '@/utils/format';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
  },
  icon: {
    color: '#5A7186',
    fontSize: '24px',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    minWidth: 0,
  },
  filename: {
    fontWeight: 500,
    color: '#1A2B3C',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    fontSize: '12px',
    color: '#5A7186',
  },
});

export interface UploadedDocumentRowProps {
  /** In-flight upload (renders progress). */
  progress?: UploadProgress;
  /** Completed document (renders read-only). */
  document?: BidDocument;
  onDelete?: () => void;
}

export function UploadedDocumentRow({
  progress,
  document,
  onDelete,
}: UploadedDocumentRowProps) {
  const styles = useStyles();

  if (progress) {
    return (
      <div className={styles.root}>
        <Document20Regular className={styles.icon} />
        <div className={styles.body}>
          <div className={styles.filename}>{progress.filename}</div>
          {progress.status === 'uploading' && (
            <>
              <ProgressBar value={progress.progress} max={100} />
              <span className={styles.meta}>{progress.progress}% uploaded</span>
            </>
          )}
          {progress.status === 'complete' && (
            <Badge appearance="filled" color="success">
              Upload complete
            </Badge>
          )}
          {progress.status === 'error' && (
            <Badge appearance="filled" color="danger">
              {progress.errorMessage ?? 'Upload failed'}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  if (document) {
    return (
      <div className={styles.root}>
        <Document20Regular className={styles.icon} />
        <div className={styles.body}>
          <div className={styles.filename}>{document.filename}</div>
          <span className={styles.meta}>
            {formatFileSize(document.sizeBytes)} · uploaded
          </span>
        </div>
        {onDelete && (
          <Button
            appearance="subtle"
            icon={<Delete20Regular />}
            aria-label={`Delete ${document.filename}`}
            onClick={onDelete}
          />
        )}
      </div>
    );
  }

  return null;
}