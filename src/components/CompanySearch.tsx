'use client';

import { useState } from 'react';

interface CompanySearchProps {
  onSearch: (ticker: string) => void;
  currentTicker: string;
  isLoading: boolean;
}

const POPULAR_STOCKS = ['CBA', 'NAB', 'BHP'];

export default function CompanySearch({ onSearch, currentTicker, isLoading }: CompanySearchProps) {
  const [ticker, setTicker] = useState(currentTicker);
  const [error, setError] = useState('');

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
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setTicker(value);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTicker(ticker)) {
      onSearch(ticker);
    }
  };

  const handlePopularClick = (stock: string) => {
    setTicker(stock);
    setError('');
    onSearch(stock);
  };

  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-stretch">
          <span className="inline-flex items-center px-4 bg-[#f8f9fa] border border-r-0 border-[#e9ecef] rounded-l-md text-[#6c757d] font-medium">
            ASX:
          </span>
          <input
            type="text"
            value={ticker}
            onChange={handleInputChange}
            placeholder="Enter ticker"
            className="flex-1 px-4 py-3 border border-[#e9ecef] text-[#212529] placeholder-[#6c757d] focus:outline-none focus:ring-2 focus:ring-[#20705c] focus:border-transparent uppercase"
            disabled={isLoading}
            aria-label="Stock ticker symbol"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-[#20705c] text-white font-semibold rounded-r-md hover:bg-[#1a5d4c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search for company"
          >
            {isLoading ? (
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
      </form>

      <div className="mt-4">
        <span className="text-sm text-[#6c757d]">Popular stocks:</span>
        <div className="flex gap-2 mt-2">
          {POPULAR_STOCKS.map((stock) => (
            <button
              key={stock}
              onClick={() => handlePopularClick(stock)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[#20705c] bg-[#f8f9fa] border border-[#e9ecef] rounded-md hover:bg-[#e9ecef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stock}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
