'use client';

import { useState, useCallback } from 'react';
import { ComparisonBoard } from '@/components/comparison';
import CompanySearch from '@/components/CompanySearch';
import { fetchCompanyInfo, fetchQuoteData } from '@/lib/api';
import { ComparisonItem } from '@/types';

function getErrorMessage(status: string, ticker: string): string {
  switch (status) {
    case '404':
      return `Ticker '${ticker}' not found`;
    case '400':
      return 'Invalid request';
    default:
      return 'Failed to fetch data';
  }
}

export default function Home() {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);

  const handleAddTicker = useCallback(async (ticker: string) => {
    // Add ticker with loading state
    const newItem: ComparisonItem = {
      ticker,
      loading: true,
    };

    setComparisonItems((prev) => [...prev, newItem]);

    try {
      const [companyData, quoteData] = await Promise.all([
        fetchCompanyInfo(ticker),
        fetchQuoteData(ticker),
      ]);

      setComparisonItems((prev) =>
        prev.map((item) =>
          item.ticker === ticker
            ? { ...item, loading: false, companyData, quoteData }
            : item
        )
      );
    } catch (err) {
      const status = err instanceof Error ? err.message : 'unknown';
      setComparisonItems((prev) =>
        prev.map((item) =>
          item.ticker === ticker
            ? { ...item, loading: false, error: getErrorMessage(status, ticker) }
            : item
        )
      );
    }
  }, []);

  const handleRemoveTicker = useCallback((ticker: string) => {
    setComparisonItems((prev) => prev.filter((item) => item.ticker !== ticker));
  }, []);

  const tickers = comparisonItems.map((item) => item.ticker);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9ecef] py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#212529]">
            ASX Stock Comparison
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        <CompanySearch
          comparisonMode={true}
          tickers={tickers}
          onSearch={handleAddTicker}
          onRemove={handleRemoveTicker}
          maxTickers={5}
          title="Compare Stocks"
        />

        <ComparisonBoard
          items={comparisonItems}
          onRemove={handleRemoveTicker}
          maxTickers={5}
        />
      </main>
    </div>
  );
}
