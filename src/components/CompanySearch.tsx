'use client';

import { useState } from 'react';

interface CompanySearchProps {
  /** Called when a ticker is submitted/added */
  onSearch: (ticker: string) => void;
  /** Current/initial ticker value (single mode) */
  currentTicker?: string;
  /** Loading state for the search button (single mode) */
  isLoading?: boolean;
  /** Enable comparison mode with multiple tickers */
  comparisonMode?: boolean;
  /** List of currently selected tickers (comparison mode) */
  tickers?: string[];
  /** Called when removing a ticker (comparison mode) */
  onRemove?: (ticker: string) => void;
  /** Maximum number of tickers allowed (comparison mode) */
  maxTickers?: number;
  /** Title to display above the search */
  title?: string;
}

const POPULAR_STOCKS = ['CBA', 'NAB', 'ANZ', 'WBC', 'BHP'];

export default function CompanySearch({
  onSearch,
  currentTicker = '',
  isLoading = false,
  comparisonMode = false,
  tickers = [],
  onRemove,
  maxTickers = 3,
  title,
}: CompanySearchProps) {
  const [input, setInput] = useState(currentTicker);
  const [error, setError] = useState('');

  const isMaxReached = comparisonMode && tickers.length >= maxTickers;
  const isDisabled = isLoading || isMaxReached;

  const validateTicker = (value: string): boolean => {
    const alphanumericOnly = /^[A-Z0-9]+$/;
    if (!value) {
      setError('Please enter a ticker symbol');
      return false;
    }
    if (value.length < 3) {
      setError('Ticker must be at least 3 characters');
      return false;
    }
    if (!alphanumericOnly.test(value)) {
      setError('Only letters and numbers are allowed');
      return false;
    }
    if (comparisonMode && tickers.includes(value)) {
      setError('Ticker already added');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    setInput(value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTicker(input)) {
      onSearch(input);
      if (comparisonMode) {
        setInput('');
      }
    }
  };

  const handlePopularClick = (stock: string) => {
    if (comparisonMode) {
      if (!tickers.includes(stock) && !isMaxReached) {
        onSearch(stock);
      }
    } else {
      setInput(stock);
      setError('');
      onSearch(stock);
    }
  };

  const getPlaceholder = (): string => {
    if (comparisonMode && isMaxReached) {
      return `Max ${maxTickers} tickers`;
    }
    return 'Enter ticker';
  };

  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
      {title && (
        <h2 className="text-lg font-semibold text-[#212529] mb-4">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-stretch">
          <span className="inline-flex items-center px-4 bg-[#f8f9fa] border border-r-0 border-[#e9ecef] rounded-l-md text-[#6c757d] font-medium">
            ASX:
          </span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            maxLength={3}
            className="flex-1 px-4 py-3 border border-[#e9ecef] text-[#212529] placeholder-[#6c757d] focus:outline-none focus:ring-2 focus:ring-[#20705c] focus:border-transparent uppercase disabled:bg-[#f8f9fa] disabled:cursor-not-allowed"
            disabled={isDisabled}
            aria-label="Stock ticker symbol"
          />
          <button
            type="submit"
            disabled={isDisabled || (comparisonMode && !input)}
            className="px-6 py-3 bg-[#20705c] text-white font-semibold rounded-r-md hover:bg-[#1a5d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={comparisonMode ? 'Add ticker to comparison' : 'Search for company'}
          >
            {comparisonMode ? (
              'Add'
            ) : isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-[#dc3545]" role="alert">{error}</p>
        )}
        {comparisonMode && (
          <p className="mt-2 text-sm text-[#6c757d]">
            Compare up to {maxTickers} Australian Stock Exchange listed companies
          </p>
        )}
      </form>

      {/* Popular stocks */}
      <div className="mt-4">
        <span className="text-sm text-[#6c757d]">Popular stocks:</span>
        <div className="flex gap-2 mt-2">
          {POPULAR_STOCKS.map((stock) => (
            <button
              key={stock}
              onClick={() => handlePopularClick(stock)}
              disabled={isLoading || (comparisonMode && (isMaxReached || tickers.includes(stock)))}
              className="px-4 py-2 text-sm font-medium text-[#20705c] bg-[#f8f9fa] border border-[#e9ecef] rounded-md hover:bg-[#e9ecef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock}
            </button>
          ))}
        </div>
      </div>

      {/* Selected tickers (comparison mode only) */}
      {comparisonMode && tickers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tickers.map((ticker) => (
            <span
              key={ticker}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-full text-sm font-medium text-[#212529]"
            >
              {ticker}
              <button
                onClick={() => onRemove?.(ticker)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#e9ecef] text-[#6c757d] hover:text-[#dc3545] transition-colors"
                aria-label={`Remove ${ticker}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Ticker count (comparison mode only) */}
      {comparisonMode && (
        <p className="mt-3 text-xs text-[#6c757d]">
          {tickers.length}/{maxTickers} stocks selected
        </p>
      )}
    </div>
  );
}
