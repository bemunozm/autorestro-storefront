'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    // In production, the middleware resolves the slug from the domain
    // In development (localhost), show a landing/redirect page
    const hostname = window.location.hostname;
    
    // If accessing via subdomain (e.g., takosushi.autorestro.cl)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        setSlug(parts[0]);
      }
    }
  }, []);

  // If slug detected from subdomain, redirect
  useEffect(() => {
    if (slug) {
      window.location.href = `/${slug}`;
    }
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">🍽️ Auto-Restro</h1>
        <p className="text-lg text-gray-600">
          Plataforma de pedidos para restaurantes
        </p>
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Para acceder a un restaurante, usa su URL directa:
          </p>
          <code className="block text-sm bg-gray-100 rounded-lg p-3 text-gray-700">
            tu-restaurante.autorestro.cl
          </code>
          <p className="text-xs text-gray-400">
            o navega a <code>/slug-del-restaurante</code>
          </p>
        </div>
        <p className="text-xs text-gray-400">
          ¿Eres dueño de restaurante?{' '}
          <a href="https://autorestro-landing.vercel.app" className="underline hover:text-gray-600">
            Conoce más aquí
          </a>
        </p>
      </div>
    </div>
  );
}
