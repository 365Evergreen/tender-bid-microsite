/**
 * useFileUpload — orchestrates one or more file uploads with progress.
 *
 * Returns the in-flight upload list (so the UI can show per-file progress),
 * plus an `upload` action. Successful uploads return a BidDocument record
 * that callers attach to the bid.
 */

import { useCallback, useState } from 'react';

import { uploadDocument } from '@/services/uploads';
import type { BidDocument, DocumentKind, UploadProgress } from '@/types';

interface UploadRequest {
  file: File;
  kind: DocumentKind;
  bidId?: string;
}

interface UploadOutcome {
  document: BidDocument;
  request: UploadRequest;
}

interface UseFileUploadResult {
  uploads: UploadProgress[];
  upload: (req: UploadRequest) => Promise<UploadOutcome>;
  uploadMany: (reqs: UploadRequest[]) => Promise<UploadOutcome[]>;
  clearCompleted: () => void;
}

export function useFileUpload(): UseFileUploadResult {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const updateUpload = useCallback(
    (id: string, patch: Partial<UploadProgress>) => {
      setUploads((prev) =>
        prev.map((u) => (u.documentId === id ? { ...u, ...patch } : u)),
      );
    },
    [],
  );

  const upload = useCallback(
    async (req: UploadRequest): Promise<UploadOutcome> => {
      const documentId = crypto.randomUUID();
      setUploads((prev) => [
        ...prev,
        {
          documentId,
          filename: req.file.name,
          progress: 0,
          status: 'uploading',
        },
      ]);

      try {
        const document = await uploadDocument(req, (percent) => {
          updateUpload(documentId, { progress: percent });
        });
        updateUpload(documentId, { status: 'complete', progress: 100 });
        return { document, request: req };
      } catch (err) {
        updateUpload(documentId, {
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Upload failed',
        });
        throw err;
      }
    },
    [updateUpload],
  );

  const uploadMany = useCallback(
    async (reqs: UploadRequest[]): Promise<UploadOutcome[]> => {
      const settled = await Promise.allSettled(reqs.map((r) => upload(r)));
      return settled
        .filter((s): s is PromiseFulfilledResult<UploadOutcome> => s.status === 'fulfilled')
        .map((s) => s.value);
    },
    [upload],
  );

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== 'complete'));
  }, []);

  return { uploads, upload, uploadMany, clearCompleted };
}