'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveOrder } from '@/lib/guest-orders';


export default function TrackLookupPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { basePath, restaurant } = useRestaurant();

  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const activeOrder = hasMounted ? getActiveOrder(slug) : null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (trimmed.length < 4) {
      setError('Ingresa al menos 4 caracteres del número de pedido');
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const res = await api.get(`/storefront/${slug}/orders/lookup`, {
        params: { orderNumber: trimmed },
      });
      router.push(`${basePath}/track/${res.data.id}`);
    } catch {
      setError('No encontramos un pedido con ese número. Verifica e intenta de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">

        {/* Restaurant branding */}
        <div className="flex flex-col items-center gap-3 pb-2">
          {restaurant?.logoUrl ? (
            <Image
              src={restaurant.logoUrl}
              alt={restaurant.name}
              width={72}
              height={72}
              className="h-14 w-auto object-contain"
              priority
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-black text-(--color-primary)">
                {restaurant?.name?.charAt(0) ?? '?'}
              </span>
            </div>
          )}
          <h1 className="text-base font-bold text-gray-800 tracking-tight">
            {restaurant?.name}
          </h1>
        </div>

        {/* Lookup card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Seguir mi pedido
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ingresa el número de pedido que recibiste en tu comprobante.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Numero de pedido
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="Ej: A1B2C3D4"
                  maxLength={8}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="
                    w-full h-12 px-4 pr-12 rounded-xl
                    border border-gray-200
                    text-center text-lg font-mono font-bold tracking-widest text-gray-900
                    placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm
                    focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary)
                    transition-shadow bg-white
                  "
                />
                <Search
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSearching || orderNumber.trim().length < 4}
              className="
                w-full h-12 rounded-xl
                bg-(--color-primary) text-white font-semibold text-sm
                hover:opacity-90 active:scale-[0.98] transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isSearching ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Buscando...
                </>
              ) : (
                'Buscar pedido'
              )}
            </button>
          </form>
        </div>

        {/* Active order quick-access */}
        {activeOrder && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Pedido en curso
            </p>
            <button
              onClick={() => router.push(`${basePath}/track/${activeOrder.orderId}`)}
              className="w-full flex items-center justify-between gap-3 group"
              aria-label={`Ver estado del pedido #${activeOrder.orderNumber}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse bg-green-500"
                  aria-hidden="true"
                />
                <span className="font-bold text-gray-900 font-mono tracking-wider truncate">
                  #{activeOrder.orderNumber}
                </span>
                <span className="text-sm text-gray-400 truncate">
                  En curso
                </span>
              </div>
              <span className="text-sm text-(--color-primary) font-semibold shrink-0 group-hover:underline">
                Ver estado
              </span>
            </button>
          </div>
        )}

        {/* Back to menu */}
        <div className="text-center pt-1">
          <Link
            href={`${basePath}/menu`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Volver al menú
          </Link>
        </div>

      </div>
    </div>
  );
}
