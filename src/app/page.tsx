'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ComparisonBoard } from '@/components/comparison';
import CompanySearch from '@/components/CompanySearch';
import CompanyInfo from '@/components/CompanyInfo';
import SavedComparisonsModal from '@/components/comparison/SavedComparisonsModal';
import { fetchCompanyInfo, fetchQuoteData } from '@/lib/api';
import {
  saveComparison,
  loadSavedComparisons,
  deleteSavedComparison,
  generateShareUrl,
  parseTickersFromUrl,
  copyToClipboard,
  SavedComparison,
} from '@/lib/comparison-utils';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [initialized, setInitialized] = useState(false);

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

  // Load tickers from URL on initial render
  useEffect(() => {
    if (initialized) return;
    const urlTickers = parseTickersFromUrl(searchParams);
    if (urlTickers.length > 0) {
      // Clear URL params after loading
      router.replace(window.location.pathname, { scroll: false });
      // Load each ticker
      urlTickers.slice(0, 5).forEach((ticker) => {
        handleAddTicker(ticker);
      });
    }
    setInitialized(true);
  }, [searchParams, router, initialized, handleAddTicker]);

  // Refresh saved comparisons when modal opens
  useEffect(() => {
    if (showSavedModal) {
      setSavedComparisons(loadSavedComparisons());
    }
  }, [showSavedModal]);

  const handleSaveComparison = useCallback(() => {
    const currentTickers = comparisonItems.map((item) => item.ticker);
    if (currentTickers.length === 0) return;
    saveComparison(currentTickers);
    // Show brief feedback by opening saved modal
    setSavedComparisons(loadSavedComparisons());
  }, [comparisonItems]);

  const handleShareComparison = useCallback(async () => {
    const currentTickers = comparisonItems.map((item) => item.ticker);
    if (currentTickers.length === 0) return;
    const url = generateShareUrl(currentTickers);
    await copyToClipboard(url);
  }, [comparisonItems]);

  const handleViewSaved = useCallback(() => {
    setShowSavedModal(true);
  }, []);

  const handleCloseSavedModal = useCallback(() => {
    setShowSavedModal(false);
  }, []);

  const handleLoadSavedComparison = useCallback((savedTickers: string[]) => {
    // Clear current items and load saved ones
    setComparisonItems([]);
    setShowSavedModal(false);
    // Add each ticker with a small delay to avoid race conditions
    savedTickers.forEach((ticker) => {
      handleAddTicker(ticker);
    });
  }, [handleAddTicker]);

  const handleDeleteSavedComparison = useCallback((id: string) => {
    deleteSavedComparison(id);
    setSavedComparisons(loadSavedComparisons());
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
          onSave={handleSaveComparison}
          onShare={handleShareComparison}
          onViewSaved={handleViewSaved}
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

      {/* Saved Comparisons Modal */}
      <SavedComparisonsModal
        isOpen={showSavedModal}
        savedComparisons={savedComparisons}
        onClose={handleCloseSavedModal}
        onLoad={handleLoadSavedComparison}
        onDelete={handleDeleteSavedComparison}
      />
    </div>
  );
}
