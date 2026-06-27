/**
 * Supporting document (uploaded as part of a bid) type.
 *
 * Documents are uploaded to the bid via a multipart endpoint. The server
 * returns a document ID that we attach to the bid's documentIds array.
 */

export type DocumentKind =
  | 'company_profile'
  | 'financial_statement'
  | 'insurance_certificate'
  | 'tax_clearance'
  | 'technical_proposal'
  | 'reference_letter'
  | 'compliance_certificate'
  | 'other';

export interface BidDocument {
  id: string;
  bidId?: string; // attached once bid is submitted
  vendorId: string;
  kind: DocumentKind;
  /** Original filename. */
  filename: string;
  /** MIME type. */
  mimeType: string;
  /** Size in bytes. */
  sizeBytes: number;
  /** Server-side storage URL — never the raw S3 link. */
  url: string;
  uploadedAt: string;
  /** Server-side virus-scan status. */
  scanStatus: 'pending' | 'clean' | 'infected';
}

/** Client-side upload state during in-flight multipart upload. */
export interface UploadProgress {
  documentId: string;
  filename: string;
  progress: number; // 0-100
  status: 'queued' | 'uploading' | 'complete' | 'error';
  errorMessage?: string;
}