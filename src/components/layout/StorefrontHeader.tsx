'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useDineInMode } from '@/hooks/useDineInMode';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { ShoppingBag, Menu, User, Bell, UtensilsCrossed, LogOut, ChevronRight, ShoppingCart } from 'lucide-react';
import { LoyaltyBadge } from '@/components/loyalty/LoyaltyBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';

export function StorefrontHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { restaurant, basePath } = useRestaurant();
  const { isDineIn, tableId } = useDineInMode();
  const { getItemCount } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Prevent hydration mismatch: Zustand stores return defaults on server,
  // real values on client after rehydration from localStorage
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  const cartCount = hasMounted ? getItemCount() : 0;

  // Use hasMounted for auth-dependent values to match server render
  const authed = hasMounted && isAuthenticated;
  const dineIn = hasMounted && isDineIn;

  const navLinks = useMemo(() => {
    if (dineIn) {
      return [
        { name: 'Menú', href: `${basePath}/menu`, icon: UtensilsCrossed },
        { name: 'Pedidos Mesa', href: `${basePath}/session`, icon: ShoppingBag },
      ];
    }
    const links = [{ name: 'Menú', href: `${basePath}/menu`, icon: UtensilsCrossed }];
    if (authed) {
      links.push({ name: 'Mis Pedidos', href: `${basePath}/orders`, icon: ShoppingCart });
    }
    return links;
  }, [dineIn, basePath, authed]);

  const handleLogout = () => {
    logout();
    router.push(basePath || '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <div className="flex items-center gap-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 rounded-r-3xl border-none">
              <SheetHeader className="p-6 text-left bg-primary/5">
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm overflow-hidden">
                    {restaurant?.logoUrl ? (
                      <img src={restaurant.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UtensilsCrossed size={20} />
                    )}
                  </div>
                  <span className="font-bold truncate">{restaurant?.name}</span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile: user profile section */}
              {authed && (
                <>
                  <div className="px-6 py-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-black shrink-0">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      {!dineIn && (
                        <div className="mt-1.5">
                          <LoyaltyBadge />
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              <div className="flex flex-col gap-2 p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      pathname === link.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </div>
                    <ChevronRight className={`h-4 w-4 ${pathname === link.href ? 'text-white/70' : 'text-muted-foreground'}`} />
                  </Link>
                ))}
                {!dineIn && !authed && (
                  <Link
                    href={`${basePath}/auth/login`}
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-muted font-bold mt-4"
                  >
                    <User className="h-5 w-5" />
                    Iniciar Sesión
                  </Link>
                )}
                {authed && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-600 font-bold mt-auto"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo & Name */}
        <Link href={basePath || '/'} className="flex items-center gap-2.5 flex-1 lg:flex-none truncate">
          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary overflow-hidden shrink-0">
            {restaurant?.logoUrl ? (
              <img src={restaurant.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <UtensilsCrossed size={18} />
            )}
          </div>
          <span className="font-black text-sm lg:text-lg tracking-tight truncate hidden sm:block">
            {restaurant?.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold transition-colors hover:text-primary relative py-1 ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
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

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mesa badge */}
          {dineIn && (
            <div className="flex items-center bg-primary/10 text-primary px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-bold text-[10px] sm:text-xs gap-1.5 mr-1 sm:mr-2 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Mesa #{tableId}
            </div>
          )}

          {!dineIn && (
            <div className="hidden lg:flex items-center gap-2">
              <LoyaltyBadge />
              {authed ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full gap-2 font-bold hover:bg-muted"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden xl:inline">{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer font-medium gap-2"
                      onClick={() => router.push(`${basePath}/orders`)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Mis Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer font-medium gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="rounded-full font-bold" onClick={() => router.push(`${basePath}/auth/login`)}>
                  Entrar
                </Button>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5">
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

            <Link href={`${basePath}/checkout`}>
              <Button size="icon" className="rounded-full w-10 h-10 shadow-lg shadow-primary/20 relative group overflow-visible">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 bg-black text-white h-5 w-5 flex items-center justify-center p-0 text-[10px] border-2 border-white group-hover:scale-110 transition-transform">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
