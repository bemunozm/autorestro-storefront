'use client';

import Image from 'next/image';
import { Category } from '@/types/menu';
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
        className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-2 lg:p-0 gap-2 lg:gap-1 snap-x snap-mandatory scroll-smooth lg:snap-none"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            data-id={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 text-left snap-center lg:snap-align-none flex items-center gap-2',
              activeCategory === category.id
                ? 'bg-(--color-primary) text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {/* Category image: only visible on desktop sidebar */}
            {category.imageUrl && (
              <span className="hidden lg:block shrink-0">
                <Image
                  src={category.imageUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full object-cover w-6 h-6"
                />
              </span>
            )}
            <span>{category.name}</span>
            <span className="text-xs opacity-60 ml-auto hidden lg:inline">
              {category.products.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
