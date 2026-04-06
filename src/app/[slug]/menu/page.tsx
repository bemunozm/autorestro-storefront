'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMenu } from '@/hooks/useMenu';
import { useDineInMode } from '@/hooks/useDineInMode';
import { useRestaurant } from '@/providers/restaurant-provider';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuHero } from '@/components/menu/MenuHero';
import { ProductCard } from '@/components/menu/ProductCard';
import { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { Search } from 'lucide-react';
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

  // useDeferredValue keeps the input responsive while filtering is deferred
  const deferredSearch = useDeferredValue(searchQuery);

  // Set first category as active by default
  useEffect(() => {
    if ((menuData?.categories?.length ?? 0) > 0 && !activeCategoryId) {
      setActiveCategoryId(menuData!.categories[0].id);
    }
  }, [menuData, activeCategoryId]);

  // Scroll spy: update active category as sections enter the viewport
  useEffect(() => {
    if (!menuData?.categories || searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategoryId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    menuData.categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuData, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!menuData?.categories) return [];

    if (!deferredSearch) return menuData.categories;

    return menuData.categories
      .map((category) => ({
        ...category,
        products: category.products.filter(
          (product) =>
            product.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
            product.description?.toLowerCase().includes(deferredSearch.toLowerCase())
        ),
      }))
      .filter((category) => category.products.length > 0);
  }, [menuData, deferredSearch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex gap-2 overflow-hidden">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MenuHero />
      {/* Dine-in Banner */}
      {isDineIn && (
        <div className="bg-primary px-4 py-2 flex items-center justify-between shadow-sm sticky top-16 z-20 transition-all">
          <div className="flex items-center gap-2 text-white">
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-none rounded-lg px-2 py-1 flex items-center gap-1.5 font-bold"
            >
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
        <aside className="lg:w-64 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:p-4 lg:border-r bg-transparent overflow-y-auto z-20">
          {/* Search - mobile: above categories, desktop: in sidebar */}
          <div className="p-4 lg:mb-6 lg:p-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar platillo..."
                className="pl-10 rounded-full bg-white lg:bg-gray-50 border border-gray-200 lg:border-none h-11 focus-visible:ring-1 focus-visible:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <h2 className="hidden lg:block text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider px-1">
            Categorías
          </h2>
          <CategoryTabs
            categories={menuData?.categories || []}
            activeCategory={searchQuery ? '' : activeCategoryId}
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
                className="text-(--color-primary) font-bold mt-2 hover:underline"
              >
                Ver todo el menú
              </button>
            </div>
          ) : (
            <div className="space-y-12 pb-24">
              {filteredCategories.map((category) => (
                <section key={category.id} id={category.id} className="scroll-mt-32">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {category.name}
                    </h2>
                    <span className="text-sm text-muted-foreground font-medium">
                      {category.products.length} {category.products.length === 1 ? 'plato' : 'platos'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
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

    </div>
  );
}
