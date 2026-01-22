'use client';

import { useState } from 'react';
import { QuoteData, CompanyData } from '@/types';
import KeyStatsTable from './KeyStatsTable';

interface ComparisonColumnProps {
  ticker: string;
  loading: boolean;
  error?: string;
  quoteData?: QuoteData;
  companyData?: CompanyData;
  onRemove: () => void;
}

export default function ComparisonColumn({
  ticker,
  loading,
  error,
  quoteData,
  companyData,
  onRemove,
}: ComparisonColumnProps) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const truncateText = (text: string, lines: number = 3): string => {
    const words = text.split(' ');
    const avgWordsPerLine = 12;
    const maxWords = lines * avgWordsPerLine;
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const shouldShowReadMore = (text: string): boolean => {
    const words = text.split(' ');
    const avgWordsPerLine = 12;
    const maxWords = 3 * avgWordsPerLine;
    return words.length > maxWords;
  };

  return (
    <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] min-w-[320px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e9ecef]">
        <h3 className="text-lg font-bold text-[#212529]">{ticker}</h3>
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f8f9fa] text-[#6c757d] hover:text-[#dc3545] transition-colors"
          aria-label={`Remove ${ticker}`}
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

      {/* Content */}
      <div className="p-4 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="inline-block w-8 h-8 border-3 border-[#20705c] border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}

        {error && (
          <div className="py-4">
            <p className="text-[#dc3545] text-sm" role="alert">{error}</p>
          </div>
        )}

        {!loading && !error && quoteData && (
          <div className="space-y-4">
            <KeyStatsTable data={quoteData} />

            {companyData && companyData.company_info && (
              <div className="pt-4 border-t border-[#e9ecef]">
                <h4 className="text-sm font-semibold text-[#6c757d] mb-2">About</h4>
                <p className="text-sm text-[#212529] leading-relaxed">
                  {isAboutExpanded
                    ? companyData.company_info
                    : truncateText(companyData.company_info)}
                </p>
                {shouldShowReadMore(companyData.company_info) && (
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="text-sm text-[#20705c] hover:text-[#185a4a] font-medium mt-2 transition-colors"
                  >
                    {isAboutExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
