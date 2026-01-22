'use client';

import { ComparisonItem } from '@/types';
import ComparisonColumn from './ComparisonColumn';

interface ComparisonGridProps {
  items: ComparisonItem[];
  onRemove: (ticker: string) => void;
}

export default function ComparisonGrid({ items, onRemove }: ComparisonGridProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-fit">
        {items.map((item) => (
          <ComparisonColumn
            key={item.ticker}
            ticker={item.ticker}
            loading={item.loading}
            error={item.error}
            quoteData={item.quoteData}
            companyData={item.companyData}
            onRemove={() => onRemove(item.ticker)}
          />
        ))}
      </div>
    </div>
  );
}
