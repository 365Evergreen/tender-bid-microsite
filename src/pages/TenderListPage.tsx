/**
 * TenderListPage — searchable list of all tenders.
 *
 * Filter by status, category; search by reference/title/buyer. Renders
 * results as compact cards. Click → tender detail.
 */

import { useState } from 'react';
import { makeStyles, tokens, Input, Select, Button } from '@fluentui/react-components';
import { Search20Regular } from '@fluentui/react-icons';
import { Link as RouterLink } from 'react-router-dom';

import { useTenders } from '@/hooks/useTenders';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency, relativeDays } from '@/utils/format';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '36px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalM,
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr auto',
    gap: tokens.spacingHorizontalM,
    alignItems: 'end',
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  row: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalL,
    textDecoration: 'none',
    color: 'inherit',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: tokens.spacingHorizontalL,
    transition: 'border-color 120ms ease',
    '&:hover': {
      borderTopColor: '#B8860B',
      borderRightColor: '#B8860B',
      borderBottomColor: '#B8860B',
      borderLeftColor: '#B8860B',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  ref: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalXS,
  },
  name: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
    lineHeight: 1.3,
  },
  meta: {
    fontSize: '13px',
    color: '#5A7186',
    marginBottom: tokens.spacingVerticalS,
  },
  tags: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  tag: {
    display: 'inline-block',
    padding: `2px 8px`,
    backgroundColor: '#F4F6F8',
    color: '#26405A',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '2px',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: tokens.spacingVerticalXS,
    textAlign: 'right',
  },
  value: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '20px',
    fontWeight: 600,
    color: '#B8860B',
  },
  closing: {
    fontSize: '13px',
    color: '#26405A',
  },
});

export function TenderListPage() {
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const { data, isLoading } = useTenders({
    search: search || undefined,
    status: (status || undefined) as 'open' | 'closing_soon' | 'closed' | 'awarded' | undefined,
    category: category || undefined,
  });

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Open tenders</h1>

      <div className={styles.filters}>
        <Input
          placeholder="Search by reference, title, or buyer"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
          contentBefore={<Search20Regular />}
        />
        <Select
          value={status}
          onChange={(_, d) => setStatus(d.value)}
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closing_soon">Closing soon</option>
          <option value="closed">Closed</option>
          <option value="awarded">Awarded</option>
        </Select>
        <Select value={category} onChange={(_, d) => setCategory(d.value)}>
          <option value="">All categories</option>
          <option value="construction">Construction</option>
          <option value="it_services">IT services</option>
          <option value="consulting">Consulting</option>
          <option value="supplies">Supplies</option>
          <option value="maintenance">Maintenance</option>
          <option value="professional_services">Professional services</option>
        </Select>
        <Button appearance="subtle" onClick={() => { setSearch(''); setStatus(''); setCategory(''); }}>
          Clear
        </Button>
      </div>

      {isLoading && <Loading label="Loading tenders…" />}

      {!isLoading && data && data.items.length === 0 && (
        <EmptyState
          title="No tenders match your filters"
          description="Try clearing filters or broadening your search."
        />
      )}

      {!isLoading && data && data.items.length > 0 && (
        <div className={styles.list}>
          {data.items.map((t) => (
            <RouterLink key={t.id} to={`/tenders/${t.id}`} className={styles.row}>
              <div>
                <div className={styles.ref}>{t.reference}</div>
                <div className={styles.name}>{t.title}</div>
                <div className={styles.meta}>{t.buyer} · {t.location ?? '—'}</div>
                <div className={styles.tags}>
                  <span className={styles.tag}>{t.category.replace('_', ' ')}</span>
                  <span className={styles.tag}>{t.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.value}>
                  {formatCurrency(t.estimatedValue.amount, t.estimatedValue.currency)}
                </div>
                <div className={styles.closing}>{relativeDays(t.closingAt)}</div>
              </div>
            </RouterLink>
          ))}
        </div>
      )}
    </div>
  );
}