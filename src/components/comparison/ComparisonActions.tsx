'use client';

import { useState } from 'react';

interface ComparisonActionsProps {
  tickers: string[];
  onSave: () => void;
  onViewSaved: () => void;
  onShare: () => void;
}

export default function ComparisonActions({
  tickers,
  onSave,
  onViewSaved,
  onShare,
}: ComparisonActionsProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleShare = () => {
    onShare();
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (tickers.length === 0) return null;

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      {/* View Saved Button */}
      <button
        onClick={onViewSaved}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#495057] bg-white border border-[#dee2e6] rounded-lg hover:bg-[#f8f9fa] hover:border-[#adb5bd] transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        Saved
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${showSaved
          ? 'text-white bg-[#198754] border border-[#198754]'
          : 'text-[#495057] bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] hover:border-[#adb5bd]'
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {showSaved ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          )}
        </svg>
        {showSaved ? 'Saved!' : 'Save'}
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#495057] bg-white border border-[#dee2e6] rounded-lg hover:bg-[#f8f9fa] hover:border-[#adb5bd] transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {showCopied ? 'Copied!' : 'Share'}
      </button>
    </div>
  );
}
