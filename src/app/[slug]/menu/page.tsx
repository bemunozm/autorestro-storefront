'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMenu } from '@/hooks/useMenu';
import { useDineInMode } from '@/hooks/useDineInMode';
import { useRestaurant } from '@/providers/restaurant-provider';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { ProductCard } from '@/components/menu/ProductCard';
import { FloatingCartButton } from '@/components/menu/FloatingCartButton';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Search, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { basePath } = useRestaurant();
  const { data: menuData, isLoading } = useMenu(slug);
  const { isDineIn, tableId } = useDineInMode();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Set first category as active by default
  useEffect(() => {
    if ((menuData?.categories?.length ?? 0) > 0 && !activeCategoryId) {
      setActiveCategoryId(menuData!.categories[0].id);
    }
  }, [menuData, activeCategoryId]);

  const filteredCategories = useMemo(() => {
    if (!menuData?.categories) return [];
    
    if (!searchQuery) return menuData.categories;

    return menuData.categories.map(category => ({
      ...category,
      products: category.products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.products.length > 0);
  }, [menuData, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-16 border-b flex items-center px-4 gap-4 sticky top-0 bg-white z-30">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex gap-2 overflow-hidden">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center px-4 gap-4 sticky top-0 z-30 shadow-sm">
        <button 
          onClick={() => router.push(basePath || '/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="relative h-10 w-10 flex-shrink-0">
            {menuData?.restaurant.logoUrl ? (
              <Image
                src={menuData.restaurant.logoUrl}
                alt={menuData.restaurant.name}
                fill
                className="object-contain rounded-full border border-gray-100"
              />
            ) : (
              <div className="h-full w-full bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center">
                <UtensilsCrossed size={20} />
              </div>
            )}
          </div>
          <h1 className="font-bold text-lg truncate text-gray-900">
            {menuData?.restaurant.name}
          </h1>
        </div>
      </header>

      {/* Dine-in Banner */}
      {isDineIn && (
        <div className="bg-primary px-4 py-2 flex items-center justify-between shadow-sm sticky top-16 z-20 transition-all">
          <div className="flex items-center gap-2 text-white">
            <Badge variant="outline" className="bg-white/20 text-white border-none rounded-lg px-2 py-1 flex items-center gap-1.5 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Mesa #{tableId}
            </Badge>
          </div>
          <button 
            onClick={() => router.push(`${basePath}/session`)}
            className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/10 px-3 py-1.5 rounded-full hover:bg-black/20 transition-colors flex items-center gap-1"
          >
            Ver Mesa
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Categories (Sidebar/Tabs) */}
        <aside className="lg:w-64 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 p-4 lg:border-r bg-white lg:bg-transparent overflow-y-auto z-20">
          <div className="mb-4 lg:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar platillo..."
                className="pl-10 rounded-full bg-gray-50 border-none h-11 focus-visible:ring-1 focus-visible:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <h2 className="hidden lg:block text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider">Categorías</h2>
          <CategoryTabs 
            categories={menuData?.categories || []} 
            activeCategory={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-4 lg:p-8">
          {filteredCategories.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No encontramos lo que buscas</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[var(--color-primary)] font-bold mt-2 hover:underline"
              >
                Ver todo el menú
              </button>
            </div>
          ) : (
            <div className="space-y-12 pb-24">
              {filteredCategories.map((category) => (
                <section 
                  key={category.id} 
                  id={category.id}
                  className="scroll-mt-32"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    {category.name}
                    <span className="h-1 flex-1 bg-gray-100 rounded-full hidden sm:block"></span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      <FloatingCartButton />
    </div>
  );
}
