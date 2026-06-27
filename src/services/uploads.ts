/**
 * Uploads service — multipart upload of supporting documents.
 *
 * Uses XHR so we get upload progress. The server returns a BidDocument
 * record (id + storage URL) which the client attaches to a bid's
 * documentIds array.
 */

import { upload } from './api';
import type { BidDocument, DocumentKind } from '@/types';

export interface UploadDocumentPayload {
  file: File;
  kind: DocumentKind;
  bidId?: string;
}

export function uploadDocument(
  payload: UploadDocumentPayload,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal,
): Promise<BidDocument> {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('kind', payload.kind);
  if (payload.bidId) formData.append('bidId', payload.bidId);

  return upload<BidDocument>('/documents', formData, {
    onUploadProgress: onProgress,
    signal,
  });
}

export function deleteDocument(documentId: string): Promise<void> {
  return upload<void>(`/documents/${encodeURIComponent(documentId)}`, new FormData());
}

export function listMyDocuments(): Promise<BidDocument[]> {
  return upload<BidDocument[]>('/documents/mine', new FormData());
}