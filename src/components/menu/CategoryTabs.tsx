'use client';

import { Category } from '@/types/menu';
// CategoryTabs receives full Category objects (with products) to compute counts on desktop
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = scrollRef.current?.querySelector(`[data-id="${activeCategory}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-16 z-20 bg-white border-b lg:border-none lg:static lg:block">
      <div 
        ref={scrollRef}
        className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-2 lg:p-0 gap-2 lg:gap-1"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            data-id={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium whitespace-nowrap transition-all text-left",
              activeCategory === category.id
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {category.name}
            <span className="hidden lg:inline ml-1.5 text-xs opacity-60">({category.products.length})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
