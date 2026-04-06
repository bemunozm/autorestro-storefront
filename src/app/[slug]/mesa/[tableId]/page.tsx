'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useSessionStore } from '@/stores/session-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils, Users, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Image from 'next/image';

interface Guest {
  id: string;
  name: string;
}

interface TableSession {
  id: string;
  tableId: string;
  guests: Guest[];
  status: string;
}

export default function TableJoinPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tableId = params.tableId as string;
  const router = useRouter();
  const { restaurant, isLoading: isLoadingRest, basePath } = useRestaurant();
  const { setTable, setSession } = useSessionStore();
  const { login } = useAuthStore();

  const [session, setSessionData] = useState<TableSession | null>(null);
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/storefront/${slug}/tables/${tableId}/session`);
      setSessionData(response.data);
    } catch (error: unknown) {
      // @ts-expect-error - Error status check
      if (error?.response?.status === 404) {
        setSessionData(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, tableId]);

  useEffect(() => {
    if (tableId) {
      setTable(tableId);
      fetchSession();
    }
  }, [tableId, setTable, fetchSession]);

  const handleOpenSession = async () => {
    if (!guestName.trim()) return;
    try {
      setIsJoining(true);
      // Open session
      const openRes = await api.post(`/storefront/${slug}/sessions/open`, { tableId });
      const sessionId = openRes.data.id;
      
      // Join session
      const joinRes = await api.post(`/storefront/${slug}/sessions/${sessionId}/join`, { guestName });
      const { guestToken, sessionId: joinedSessionId, tableId: joinedTableId } = joinRes.data;

      // Persistence
      login(guestToken, null);
      setSession(joinedSessionId);
      setTable(joinedTableId);

      router.push(`${basePath}/menu`);
    } catch (error) {
      console.error('Error opening session:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinSession = async () => {
    if (!guestName.trim() || !session) return;
    try {
      setIsJoining(true);
      const joinRes = await api.post(`/storefront/${slug}/sessions/${session.id}/join`, { guestName });
      const { guestToken, sessionId, tableId: joinedTableId } = joinRes.data;

      // Persistence
      login(guestToken, null);
      setSession(sessionId);
      setTable(joinedTableId);

      router.push(`${basePath}/menu`);
    } catch (error) {
      console.error('Error joining session:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoadingRest || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Use CSS variable set by DynamicTheme (already resolved from landingConfig.theme)
  const primaryColor = 'var(--color-primary)';

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-white overflow-hidden mb-4 relative">
            {restaurant?.logoUrl ? (
              <Image src={restaurant.logoUrl} alt={restaurant.name} fill className="object-cover" />
            ) : (
              <Utensils className="h-10 w-10" style={{ color: primaryColor }} />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{restaurant?.name}</h1>
          <p className="text-muted-foreground font-medium mt-1">Mesa #{tableId}</p>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-center">
              {session ? 'Unirse a la mesa' : 'Abrir mesa'}
            </CardTitle>
            {session && session.guests.length > 0 && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {session.guests.slice(0, 4).map((guest, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                      {guest.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {session.guests.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-[10px] font-bold">
                      +{session.guests.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {session.guests.length} {session.guests.length === 1 ? 'persona ya está' : 'personas ya están'} en la mesa
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-sm font-semibold ml-1">¿Cómo te llamas?</Label>
              <Input
                id="guestName"
                placeholder="Tu nombre"
                className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary transition-all"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <Button
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
              style={{ backgroundColor: primaryColor }}
              disabled={!guestName.trim() || isJoining}
              onClick={session ? handleJoinSession : handleOpenSession}
            >
              {isJoining ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {session ? 'Unirse a la mesa' : 'Abrir mesa'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            
            <p className="text-center text-[11px] text-muted-foreground px-4 leading-relaxed">
              Al entrar, podrás ver el menú, hacer pedidos y compartirlos con otros comensales.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
