'use client';

import { useState } from 'react';
import CompanySearch from '@/components/CompanySearch';
import KeyStatistics from '@/components/KeyStatistics';
import CompanyInfo from '@/components/CompanyInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchCompanyInfo, fetchQuoteData } from '@/lib/api';
import { CompanyData, QuoteData } from '@/types';

function getErrorMessage(status: string, ticker: string): string {
  switch (status) {
    case '404':
      return `Ticker '${ticker}' not found or may be delisted`;
    case '400':
      return 'Invalid request. Please check the ticker symbol';
    default:
      return 'Failed to fetch company information. Please try again later';
  }
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [currentTicker, setCurrentTicker] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError('');
    setCurrentTicker(ticker);
    setHasSearched(true);

    try {
      const [company, quote] = await Promise.all([
        fetchCompanyInfo(ticker),
        fetchQuoteData(ticker)
      ]);

      setCompanyData(company);
      setQuoteData(quote);
    } catch (err) {
      const status = err instanceof Error ? err.message : 'unknown';
      setError(getErrorMessage(status, ticker));
      setCompanyData(null);
      setQuoteData(null);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = companyData && quoteData && !error;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e9ecef] py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#212529] mb-2">
            ASX Company Information
          </h1>
          <p className="text-[#6c757d]">
            Search for Australian Stock Exchange listed companies
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {!hasSearched ? (
          /* Initial Centered Search Layout */
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md">
              <CompanySearch
                onSearch={handleSearch}
                currentTicker={currentTicker}
                isLoading={loading}
              />
            </div>
          </div>
        ) : (
          /* Two-Column Layout After Search */
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,450px)_1fr] gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <CompanySearch
                onSearch={handleSearch}
                currentTicker={currentTicker}
                isLoading={loading}
              />

              {loading && <LoadingSpinner />}

              {error && (
                <div className="bg-white rounded-lg border border-[#dc3545] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-6">
                  <p className="text-[#dc3545]" role="alert">{error}</p>
                </div>
              )}

              {hasResults && <KeyStatistics data={quoteData} />}
            </div>

            {/* Right Column */}
            <div>
              {hasResults && <CompanyInfo data={companyData} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
