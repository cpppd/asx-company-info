'use client';

import { ComparisonItem } from '@/types';
import ComparisonGrid from './ComparisonGrid';

interface ComparisonBoardProps {
  items: ComparisonItem[];
  onRemove: (ticker: string) => void;
}

export default function ComparisonBoard({ items, onRemove }: ComparisonBoardProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e9ecef] shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-12 text-center">
        <div className="max-w-md mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-[#6c757d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-[#212529] mb-2">
            Add stocks to compare
          </h3>
          <p className="text-[#6c757d]">
            Enter up to 3 ASX ticker symbols above to see them side by side.
          </p>
        </div>
      </div>
    );
  }

  return <ComparisonGrid items={items} onRemove={onRemove} />;
}
