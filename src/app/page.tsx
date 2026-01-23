'use client';

import { useState, useCallback } from 'react';
import { ComparisonBoard } from '@/components/comparison';
import CompanySearch from '@/components/CompanySearch';
import CompanyInfo from '@/components/CompanyInfo';
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
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

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
    // Close modal if the removed ticker was selected
    if (selectedTicker === ticker) {
      setSelectedTicker(null);
    }
  }, [selectedTicker]);

  const handleTickerClick = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedTicker(null);
  }, []);

  const tickers = comparisonItems.map((item) => item.ticker);
  const selectedItem = comparisonItems.find((item) => item.ticker === selectedTicker);

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
          onTickerClick={handleTickerClick}
          maxTickers={5}
        />
      </main>

      {/* Company Info Modal */}
      {selectedTicker && selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9ecef]">
              <h2 className="text-xl font-bold text-[#212529]">
                {selectedTicker}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e9ecef] text-[#6c757d] hover:text-[#212529] transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

            {/* Modal Content */}
            <div className="p-6">
              {selectedItem.loading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="inline-block w-8 h-8 border-3 border-[#20705c] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : selectedItem.error ? (
                <div className="text-center py-12 text-[#dc3545]">
                  {selectedItem.error}
                </div>
              ) : selectedItem.companyData ? (
                <CompanyInfo data={selectedItem.companyData} />
              ) : (
                <div className="text-center py-12 text-[#6c757d]">
                  No company information available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
