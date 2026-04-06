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
    <div className="sticky top-16 z-20 bg-gray-50/80 backdrop-blur-sm border-b lg:border-none lg:static lg:block lg:bg-transparent">
      <div
        ref={scrollRef}
        className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar px-1 py-2 lg:p-0 gap-2 lg:gap-1 scroll-smooth"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            data-id={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 text-left flex items-center gap-1.5 shrink-0',
              activeCategory === category.id
                ? 'bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/20 lg:bg-primary/8 lg:text-(--color-primary) lg:font-semibold lg:shadow-none lg:rounded-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 lg:bg-transparent lg:border-none lg:hover:bg-gray-50 lg:rounded-lg'
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

            {/* Product count badge */}
            <span
              className={cn(
                'text-[10px] font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-1',
                activeCategory === category.id
                  ? 'bg-white/20 text-white lg:bg-primary/15 lg:text-(--color-primary)'
                  : 'bg-gray-100 text-gray-400 lg:ml-auto'
              )}
            >
              {category.products.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
