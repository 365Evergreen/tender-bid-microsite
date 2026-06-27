/**
 * Tenders hooks — Tanstack Query wrappers for fetching tenders.
 */

import { useQuery } from '@tanstack/react-query';

import { listTenders, getTender, listFeaturedTenders } from '@/services/tenders';
import type { TenderSummary, Tender } from '@/types';

export const tenderKeys = {
  all: ['tenders'] as const,
  list: (params: object) => ['tenders', 'list', params] as const,
  detail: (id: string) => ['tenders', 'detail', id] as const,
  featured: () => ['tenders', 'featured'] as const,
};

export function useTenders(params: Parameters<typeof listTenders>[0] = {}) {
  return useQuery({
    queryKey: tenderKeys.list(params),
    queryFn: () => listTenders(params),
    staleTime: 60_000,
  });
}

export function useTender(id: string | undefined) {
  return useQuery<Tender>({
    queryKey: tenderKeys.detail(id ?? ''),
    queryFn: () => getTender(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useFeaturedTenders() {
  return useQuery<TenderSummary[]>({
    queryKey: tenderKeys.featured(),
    queryFn: listFeaturedTenders,
    staleTime: 5 * 60_000,
  });
}