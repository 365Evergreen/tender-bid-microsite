/**
 * Tenders service — list, summary, detail.
 */

import { request } from './api';
import type { Tender, TenderSummary, PaginatedResponse } from '@/types';

export interface ListTendersParams {
  status?: 'open' | 'closing_soon' | 'closed' | 'awarded';
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function listTenders(
  params: ListTendersParams = {},
): Promise<PaginatedResponse<TenderSummary>> {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.category) search.set('category', params.category);
  if (params.search) search.set('search', params.search);
  if (params.page) search.set('page', String(params.page));
  if (params.pageSize) search.set('pageSize', String(params.pageSize));
  const qs = search.toString();
  return request<PaginatedResponse<TenderSummary>>(`/tenders${qs ? `?${qs}` : ''}`);
}

export function getTender(id: string): Promise<Tender> {
  return request<Tender>(`/tenders/${encodeURIComponent(id)}`);
}

export function listFeaturedTenders(): Promise<TenderSummary[]> {
  return request<TenderSummary[]>('/tenders/featured');
}