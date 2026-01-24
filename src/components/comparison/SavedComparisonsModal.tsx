'use client';

import { SavedComparison } from '@/lib/comparison-utils';

interface SavedComparisonsModalProps {
  isOpen: boolean;
  savedComparisons: SavedComparison[];
  onClose: () => void;
  onLoad: (tickers: string[]) => void;
  onDelete: (id: string) => void;
}

export default function SavedComparisonsModal({
  isOpen,
  savedComparisons,
  onClose,
  onLoad,
  onDelete,
}: SavedComparisonsModalProps) {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9ecef]">
          <h2 className="text-xl font-bold text-[#212529]">Saved Comparisons</h2>
          <button
            onClick={onClose}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {savedComparisons.length === 0 ? (
            <div className="text-center py-8 text-[#6c757d]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-3 text-[#adb5bd]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <p>No saved comparisons yet.</p>
              <p className="text-sm mt-1">Add stocks and click Save to store a comparison.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedComparisons.map((comparison) => (
                <div
                  key={comparison.id}
                  className="border border-[#e9ecef] rounded-lg p-4 hover:border-[#adb5bd] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {comparison.tickers.map((ticker) => (
                          <span
                            key={ticker}
                            className="inline-flex px-2 py-0.5 text-xs font-semibold bg-[#e8f5f1] text-[#20705c] rounded"
                          >
                            {ticker}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[#6c757d]">
                        {formatDate(comparison.savedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onLoad(comparison.tickers)}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-[#20705c] rounded hover:bg-[#1a5c4b] transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDelete(comparison.id)}
                        className="p-1.5 text-[#6c757d] hover:text-[#dc3545] hover:bg-[#fee] rounded transition-colors"
                        aria-label="Delete comparison"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
