'use client';

import { useState, useMemo } from 'react';
import { ComparisonItem } from '@/types';
import ComparisonColumn from './ComparisonColumn';
import {
  formatCurrency,
  formatNumber,
  formatMarketValue,
  formatChange,
} from './KeyStatsTable';

interface ComparisonGridProps {
  items: ComparisonItem[];
  onRemove: (ticker: string) => void;
}

interface StatRow {
  label: string;
  key: string;
  getValue: (item: ComparisonItem) => React.ReactNode;
  getSortValue: (item: ComparisonItem) => number;
}

type SortDirection = 'asc' | 'desc' | null;

// Threshold for switching between card and table view
const CARD_VIEW_THRESHOLD = 3;

export default function ComparisonGrid({ items, onRemove }: ComparisonGridProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Use card view for 3 or fewer tickers, table view for more than 3
  const useCardView = items.length <= CARD_VIEW_THRESHOLD;

  // Table View stat definitions with sort values
  const statRows: StatRow[] = [
    {
      label: 'Price',
      key: 'price',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote.cf_last) : '—',
      getSortValue: (item) => item.quoteData?.quote.cf_last ?? -Infinity,
    },
    {
      label: 'Change',
      key: 'change',
      getValue: (item) =>
        item.quoteData
          ? formatChange(item.quoteData.quote.cf_netchng, item.quoteData.quote.pctchng)
          : '—',
      getSortValue: (item) => item.quoteData?.quote.pctchng ?? -Infinity,
    },
    {
      label: 'Market Value',
      key: 'marketValue',
      getValue: (item) =>
        item.quoteData ? formatMarketValue(item.quoteData.quote.mkt_value) : '—',
      getSortValue: (item) => item.quoteData?.quote.mkt_value ?? -Infinity,
    },
    {
      label: 'Volume',
      key: 'volume',
      getValue: (item) =>
        item.quoteData ? formatNumber(item.quoteData.quote.cf_volume) : '—',
      getSortValue: (item) => item.quoteData?.quote.cf_volume ?? -Infinity,
    },
    {
      label: '52W High',
      key: '52wHigh',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote['52wk_high']) : '—',
      getSortValue: (item) => item.quoteData?.quote['52wk_high'] ?? -Infinity,
    },
    {
      label: '52W Low',
      key: '52wLow',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote['52wk_low']) : '—',
      getSortValue: (item) => item.quoteData?.quote['52wk_low'] ?? -Infinity,
    },
  ];

  // Handle column header click for sorting
  const handleSort = (key: string) => {
    if (sortColumn === key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // Sort items based on current sort state
  const sortedItems = useMemo(() => {
    if (!sortColumn || !sortDirection) return items;

    const statRow = statRows.find((row) => row.key === sortColumn);
    if (!statRow) return items;

    return [...items].sort((a, b) => {
      const aValue = statRow.getSortValue(a);
      const bValue = statRow.getSortValue(b);

      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [items, sortColumn, sortDirection]);

  // Render sort indicator
  const renderSortIndicator = (key: string) => {
    if (sortColumn !== key) {
      return <span className="ml-1 text-[#adb5bd]">⇅</span>;
    }
    return (
      <span className="ml-1 text-[#20705c]">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // Card View (for ≤3 tickers)
  if (useCardView) {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-fit">
          {items.map((item) => (
            <ComparisonColumn
              key={item.ticker}
              ticker={item.ticker}
              loading={item.loading}
              error={item.error}
              quoteData={item.quoteData}
              companyData={item.companyData}
              onRemove={() => onRemove(item.ticker)}
            />
          ))}
        </div>
      </div>
    );
  }

  const renderCellContent = (item: ComparisonItem, getValue: (item: ComparisonItem) => React.ReactNode) => {
    if (item.loading) {
      return (
        <span className="inline-block w-5 h-5 border-2 border-[#20705c] border-t-transparent rounded-full animate-spin" />
      );
    }
    if (item.error) {
      return <span className="text-[#dc3545] text-xs">Error</span>;
    }
    return getValue(item);
  };

  // Calculate column width: ticker column + stat columns
  const totalColumns = 1 + statRows.length;
  const columnWidth = `${100 / totalColumns}%`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-collapse overflow-hidden">
        <thead>
          <tr className="bg-[#f8f9fa] border-b border-[#e9ecef]">
            <th
              className="text-left px-4 py-3 text-sm font-semibold text-[#212529]"
              style={{ width: columnWidth }}
            >
              Ticker
            </th>
            {statRows.map((row) => (
              <th
                key={row.label}
                className="text-center px-4 py-3 text-sm font-semibold text-[#212529] cursor-pointer hover:bg-[#e9ecef] transition-colors select-none"
                style={{ width: columnWidth }}
                onClick={() => handleSort(row.key)}
              >
                <span className="inline-flex items-center justify-center">
                  {row.label}
                  {renderSortIndicator(row.key)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr
              key={item.ticker}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]/50'} hover:bg-[#e9ecef] transition-colors cursor-pointer`}
            >
              <td
                className="px-4 py-3 text-sm font-bold text-[#212529] border-r border-[#e9ecef]"
                style={{ width: columnWidth }}
              >
                <div className="flex items-center gap-2">
                  <span>{item.ticker}</span>
                  <button
                    onClick={() => onRemove(item.ticker)}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#dee2e6] text-[#6c757d] hover:text-[#dc3545] transition-colors"
                    aria-label={`Remove ${item.ticker}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </td>
              {statRows.map((row) => (
                <td
                  key={row.label}
                  className="px-4 py-3 text-sm font-semibold text-[#212529] text-center"
                  style={{ width: columnWidth }}
                >
                  {renderCellContent(item, row.getValue)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
