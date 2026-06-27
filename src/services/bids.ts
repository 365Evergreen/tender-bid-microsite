/**
 * Bids service — CRUD on the vendor's own bids.
 *
 * Submitting a bid is a separate flow: it transitions the bid from
 * 'draft' → 'submitted' and locks edits.
 */

import { request } from './api';
import type { Bid, BidDraft, BidPricing, BidCompliance } from '@/types';

export interface CreateBidPayload {
  tenderId: string;
  company: BidDraft['company'];
  contact: BidDraft['contact'];
  pricing: BidPricing;
  compliance: BidCompliance;
  documentIds: string[];
  proposal?: string;
}

export function createBid(payload: CreateBidPayload): Promise<Bid> {
  return request<Bid>('/bids', { method: 'POST', body: payload });
}

export function updateBid(bidId: string, payload: Partial<CreateBidPayload>): Promise<Bid> {
  return request<Bid>(`/bids/${encodeURIComponent(bidId)}`, {
    method: 'PATCH',
    body: payload,
  });
}

export function submitBid(bidId: string): Promise<Bid> {
  return request<Bid>(`/bids/${encodeURIComponent(bidId)}/submit`, {
    method: 'POST',
  });
}

export function listMyBids(): Promise<Bid[]> {
  return request<Bid[]>('/bids/mine');
}

export function getBid(bidId: string): Promise<Bid> {
  return request<Bid>(`/bids/${encodeURIComponent(bidId)}`);
}

export function withdrawBid(bidId: string, reason: string): Promise<Bid> {
  return request<Bid>(`/bids/${encodeURIComponent(bidId)}/withdraw`, {
    method: 'POST',
    body: { reason },
  });
}