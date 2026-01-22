'use client';

import React, { JSX } from 'react';
import { QuoteData } from '@/types';

interface KeyStatsTableProps {
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
      {sign}{percent.toFixed(2)}%
    </span>
  );
}

export default function KeyStatsTable({ data }: KeyStatsTableProps) {
  const { quote } = data;

  const stats = [
    { label: 'Current Price', value: formatCurrency(quote.cf_last) },
    { label: '% Change', value: formatChange(quote.cf_netchng, quote.pctchng) },
    { label: 'Volume', value: formatNumber(quote.cf_volume) },
    { label: 'Market Value', value: formatMarketValue(quote.mkt_value) },
    { label: '52W High', value: formatCurrency(quote['52wk_high']) },
  ];

  return (
    <ul className="space-y-2">
      {stats.map((stat, index) => (
        <li key={index} className="flex justify-between items-center text-sm">
          <span className="text-[#6c757d]">{stat.label}</span>
          <span className="font-semibold text-[#212529]">{stat.value}</span>
        </li>
      ))}
    </ul>
  );
}
