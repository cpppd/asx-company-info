import React, { JSX } from 'react';
import { QuoteData } from '@/types';

interface KeyStatisticsProps {
  data: QuoteData;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value);
}

function formatMarketValue(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return formatCurrency(value);
}

function formatChange(change: number, percent: number): JSX.Element {
  const isPositive = change >= 0;
  const sign = isPositive ? '+' : '';
  const color = isPositive ? 'text-[#198754]' : 'text-[#dc3545]';

  return (
    <span className={color}>
      {sign}{formatCurrency(change)} ({sign}{percent.toFixed(2)}%)
    </span>
  );
}

export default function KeyStatistics({ data }: KeyStatisticsProps) {
  const { quote } = data;

  const stats = [
    { label: 'Current Price', value: formatCurrency(quote.cf_last) },
    { label: 'Change', value: formatChange(quote.cf_netchng, quote.pctchng) },
    { label: 'Volume', value: formatNumber(quote.cf_volume) },
    { label: 'Market Value', value: formatMarketValue(quote.mkt_value) },
    { label: '52W High', value: formatCurrency(quote['52wk_high']) },
  ];

  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
      <h2 className="text-lg font-semibold text-[#212529] mb-4 pb-2 border-b border-[#e9ecef]">
        Key Statistics
      </h2>
      <ul className="space-y-3">
        {stats.map((stat, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-[#6c757d]">{stat.label}</span>
            <span className="font-semibold text-[#212529]">{stat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
