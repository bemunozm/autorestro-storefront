'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useDineInMode } from '@/hooks/useDineInMode';
import { useAuthStore } from '@/stores/auth-store';
import {
  ShoppingBag,
  Menu,
  Bell,
  UtensilsCrossed,
  LogOut,
  ChevronRight,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { LoyaltyBadge } from '@/components/loyalty/LoyaltyBadge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function StorefrontHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { restaurant, basePath } = useRestaurant();
  const { isDineIn, tableId } = useDineInMode();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  const authed = hasMounted && isAuthenticated;
  const dineIn = hasMounted && isDineIn;

  // Mobile drawer links — varies by mode
  const mobileLinks = useMemo(() => {
    if (dineIn) {
      return [
        { name: 'Menú', href: `${basePath}/menu`, icon: UtensilsCrossed },
        { name: 'Pedidos Mesa', href: `${basePath}/session`, icon: ShoppingBag },
      ];
    }
    const links = [
      { name: 'Menú', href: `${basePath}/menu`, icon: UtensilsCrossed },
    ];
    if (authed) {
      links.push(
        { name: 'Mis Pedidos', href: `${basePath}/orders`, icon: ShoppingCart },
        { name: 'Mis Puntos', href: `${basePath}/loyalty`, icon: Star },
      );
    }
    return links;
  }, [dineIn, basePath, authed]);

  // Desktop dine-in nav (centered, only for dine-in mode)
  const dineInDesktopLinks = useMemo(() => {
    if (!dineIn) return [];
    return [
      { name: 'Menú', href: `${basePath}/menu`, icon: UtensilsCrossed },
      { name: 'Pedidos Mesa', href: `${basePath}/session`, icon: ShoppingBag },
    ];
  }, [dineIn, basePath]);

  const handleLogout = () => {
    logout();
    router.push(basePath || '/');
  };

  const isOnMenu = pathname?.endsWith('/menu');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 lg:h-18 flex items-center justify-between gap-4">

        {/* ── Mobile: hamburger ── */}
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[350px] p-0 rounded-r-3xl border-none [&>button]:hidden flex flex-col h-full"
            >
              {/* Drawer header */}
              <SheetHeader className="px-6 py-5 text-left shrink-0">
                <SheetTitle className="flex items-center gap-3">
                  {restaurant?.logoUrl ? (
                    <img
                      src={restaurant.logoUrl}
                      alt={restaurant?.name}
                      className="h-9 w-auto max-w-40 object-contain shrink-0"
                    />
                  ) : (
                    <span className="font-bold text-lg truncate">{restaurant?.name}</span>
                  )}
                </SheetTitle>
              </SheetHeader>

              {/* User profile */}
              {authed && (
                <div className="px-6 pb-4 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary) text-sm font-black shrink-0">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user?.name} {user?.lastname}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="mx-6 border-t border-gray-100 shrink-0" />

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-4 py-4 shrink-0">
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                      pathname === link.href
                        ? 'bg-(--color-primary) text-white'
                        : 'text-gray-600 active:bg-gray-100'
                    }`}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight
                      className={`h-4 w-4 ${pathname === link.href ? 'text-white/50' : 'text-gray-300'}`}
                    />
                  </Link>
                ))}
              </nav>

              <div className="flex-1" />

              {/* Footer */}
              <div className="px-4 pb-6 shrink-0 space-y-2">
                <div className="mx-2 border-t border-gray-100 mb-4" />
                {!dineIn && !authed && (
                  <div className="space-y-2.5">
                    <Link href={`${basePath}/auth/login`} className="block">
                      <button className="w-full h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 active:bg-gray-50 transition-colors">
                        Iniciar Sesión
                      </button>
                    </Link>
                    <Link href={`${basePath}/auth/register`} className="block">
                      <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all">
                        Crear Cuenta
                      </button>
                    </Link>
                  </div>
                )}
                {authed && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 text-sm font-medium active:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ── Logo ── */}
        <Link href={basePath || '/'} className="flex items-center flex-1 lg:flex-none truncate">
          {restaurant?.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="h-8 lg:h-9 w-auto max-w-40 object-contain shrink-0"
            />
          ) : (
            <span className="font-black text-sm lg:text-lg tracking-tight truncate">
              {restaurant?.name}
            </span>
          )}
        </Link>

        {/* ── Desktop: dine-in centered nav (only in dine-in mode) ── */}
        {dineIn && dineInDesktopLinks.length > 0 && (
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {dineInDesktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-gray-400 hover:text-foreground'
                }`}
              >
                {link.name}
                <div
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    pathname === link.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`}
                />
              </Link>
            ))}
          </nav>
        )}

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2">
          {/* Dine-in: mesa badge */}
          {dineIn && (
            <div className="flex items-center bg-primary/10 text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-[10px] sm:text-xs gap-1.5 mr-1 sm:mr-2 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Mesa #{tableId}
            </div>
          )}

          {/* Dine-in: bell (desktop) */}
          {dineIn && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:flex hidden"
              onClick={() => router.push(`${basePath}/session`)}
            >
              <Bell size={20} className="text-muted-foreground" />
            </Button>
          )}

          {/* Normal mode (non dine-in): desktop actions */}
          {!dineIn && (
            <div className="hidden lg:flex items-center gap-1">
              {/* Menu link — the primary CTA */}
              <Link
                href={`${basePath}/menu`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isOnMenu
                    ? 'bg-(--color-primary)/8 text-(--color-primary)'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UtensilsCrossed size={15} />
                Menú
              </Link>

              {/* Loyalty badge (authed only) */}
              {authed && (
                <Link
                  href={`${basePath}/loyalty`}
                  aria-label="Ver mis puntos"
                  className="ml-1"
                >
                  <LoyaltyBadge />
                </Link>
              )}

              {/* User avatar dropdown or login button */}
              {authed ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors ml-1">
                      <div className="w-7 h-7 rounded-full bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary) text-xs font-black">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden xl:inline text-sm font-semibold text-gray-700">
                        {user?.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl p-1.5 bg-white border border-gray-200 shadow-lg"
                  >
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer font-medium gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:text-gray-900"
                      onClick={() => router.push(`${basePath}/orders`)}
                    >
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      Mis Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer font-medium gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:text-gray-900"
                      onClick={() => router.push(`${basePath}/loyalty`)}
                    >
                      <Star className="h-4 w-4 text-amber-400" />
                      Mis Puntos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer font-medium gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => router.push(`${basePath}/auth/login`)}
                  className="ml-1 px-5 py-2 text-sm font-bold text-white bg-(--color-primary) rounded-full hover:opacity-90 active:scale-[0.97] transition-all"
                >
                  Ingresar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
