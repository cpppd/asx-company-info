'use client';

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
  getValue: (item: ComparisonItem) => React.ReactNode;
}

// Threshold for switching between card and table view
const CARD_VIEW_THRESHOLD = 3;

export default function ComparisonGrid({ items, onRemove }: ComparisonGridProps) {
  // Use card view for 3 or fewer tickers, table view for more than 3
  const useCardView = items.length <= CARD_VIEW_THRESHOLD;

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

  // Table View (for >3 tickers)
  const statRows: StatRow[] = [
    {
      label: 'Price',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote.cf_last) : '—',
    },
    {
      label: 'Change',
      getValue: (item) =>
        item.quoteData
          ? formatChange(item.quoteData.quote.cf_netchng, item.quoteData.quote.pctchng)
          : '—',
    },
    {
      label: 'Market Value',
      getValue: (item) =>
        item.quoteData ? formatMarketValue(item.quoteData.quote.mkt_value) : '—',
    },
    {
      label: 'Volume',
      getValue: (item) =>
        item.quoteData ? formatNumber(item.quoteData.quote.cf_volume) : '—',
    },
    {
      label: '52W High',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote['52wk_high']) : '—',
    },
    {
      label: '52W Low',
      getValue: (item) =>
        item.quoteData ? formatCurrency(item.quoteData.quote['52wk_low']) : '—',
    },
  ];

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

  // Calculate column width: each column gets equal share
  const totalColumns = 1 + items.length;
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
              Key Statistics
            </th>
            {items.map((item) => (
              <th
                key={item.ticker}
                className="text-center px-4 py-3 text-sm font-bold text-[#212529]"
                style={{ width: columnWidth }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{item.ticker}</span>
                  <button
                    onClick={() => onRemove(item.ticker)}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#e9ecef] text-[#6c757d] hover:text-[#dc3545] transition-colors"
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
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statRows.map((row, index) => (
            <tr
              key={row.label}
              className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]/50'}
            >
              <td
                className="px-4 py-3 text-sm text-[#6c757d] border-r border-[#e9ecef]"
                style={{ width: columnWidth }}
              >
                {row.label}
              </td>
              {items.map((item) => (
                <td
                  key={item.ticker}
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
