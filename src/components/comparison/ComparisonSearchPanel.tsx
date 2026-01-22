'use client';

import { useState } from 'react';

interface ComparisonSearchPanelProps {
  tickers: string[];
  onAdd: (ticker: string) => void;
  onRemove: (ticker: string) => void;
  maxTickers?: number;
}

export default function ComparisonSearchPanel({
  tickers,
  onAdd,
  onRemove,
  maxTickers = 3,
}: ComparisonSearchPanelProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const isMaxReached = tickers.length >= maxTickers;

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
    if (tickers.includes(value)) {
      setError('Ticker already added');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setInput(value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTicker(input)) {
      onAdd(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
      <h2 className="text-lg font-semibold text-[#212529] mb-4">
        Compare Stocks
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex items-stretch">
          <span className="inline-flex items-center px-4 bg-[#f8f9fa] border border-r-0 border-[#e9ecef] rounded-l-md text-[#6c757d] font-medium">
            ASX:
          </span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={isMaxReached ? 'Max 3 tickers' : 'Enter ticker'}
            className="flex-1 px-4 py-3 border border-[#e9ecef] text-[#212529] placeholder-[#6c757d] focus:outline-none focus:ring-2 focus:ring-[#20705c] focus:border-transparent uppercase disabled:bg-[#f8f9fa] disabled:cursor-not-allowed"
            disabled={isMaxReached}
            aria-label="Stock ticker symbol"
          />
          <button
            type="submit"
            disabled={isMaxReached || !input}
            className="px-6 py-3 bg-[#20705c] text-white font-semibold rounded-r-md hover:bg-[#1a5d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add ticker to comparison"
          >
            Add
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-[#dc3545]" role="alert">{error}</p>
        )}
      </form>

      {/* Popular stocks */}
      <div className="mt-4">
        <span className="text-sm text-[#6c757d]">Popular stocks:</span>
        <div className="flex gap-2 mt-2">
          {['CBA', 'NAB', 'BHP'].map((stock) => (
            <button
              key={stock}
              onClick={() => {
                if (!tickers.includes(stock) && !isMaxReached) {
                  onAdd(stock);
                }
              }}
              disabled={isMaxReached || tickers.includes(stock)}
              className="px-4 py-2 text-sm font-medium text-[#20705c] bg-[#f8f9fa] border border-[#e9ecef] rounded-md hover:bg-[#e9ecef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock}
            </button>
          ))}
        </div>
      </div>

      {tickers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tickers.map((ticker) => (
            <span
              key={ticker}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-full text-sm font-medium text-[#212529]"
            >
              {ticker}
              <button
                onClick={() => onRemove(ticker)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#e9ecef] text-[#6c757d] hover:text-[#dc3545] transition-colors"
                aria-label={`Remove ${ticker}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-[#6c757d]">
        {tickers.length}/{maxTickers} stocks selected
      </p>
    </div>
  );
}
