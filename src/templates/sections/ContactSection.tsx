'use client';

import { MapPin, Phone, Mail, Clock, Map as MapIcon } from 'lucide-react';
import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';

export function ContactSection({ restaurant }: SectionProps) {
  const { address, phone } = restaurant;

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-[var(--theme-heading-font)] mb-4 text-gray-900 dark:text-white">Contacto y Ubicación</h2>
          <div className="h-1.5 w-24 bg-[var(--theme-primary,#111)] mx-auto rounded-full" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Card */}
          <ScrollReveal direction="left" className="h-full">
            <div className="h-full p-10 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800">
               <h3 className="text-2xl font-bold font-[var(--theme-heading-font)] mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                  <MapPin className="text-[var(--theme-primary)]" /> Encuéntranos
               </h3>
               
               <div className="space-y-6 mb-10">
                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 hover:bg-[var(--theme-primary)]/5 transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)] group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Dirección</h4>
                        <p className="text-gray-600 dark:text-gray-400">{address || 'Consulte dirección en sucursal'}</p>
                     </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 hover:bg-[var(--theme-primary)]/5 transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)] group-hover:scale-110 transition-transform">
                        <Phone size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Teléfono</h4>
                        <p className="text-gray-600 dark:text-gray-400">{phone || 'Teléfono no disponible'}</p>
                     </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 hover:bg-[var(--theme-primary)]/5 transition-colors group">
                     <div className="w-12 h-12 rounded-xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)] group-hover:scale-110 transition-transform">
                        <Mail size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Email</h4>
                        <p className="text-gray-600 dark:text-gray-400">hola@{restaurant.slug}.cl</p>
                     </div>
                  </div>
               </div>

               <h3 className="text-2xl font-bold font-[var(--theme-heading-font)] mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                  <Clock className="text-[var(--theme-primary)]" /> Horarios de Atención
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                     <span className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest block mb-1">Lunes a Jueves</span>
                     <p className="text-gray-900 dark:text-white font-bold">12:30 — 23:00</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                     <span className="text-xs font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest block mb-1">Vie, Sáb y Dom</span>
                     <p className="text-gray-900 dark:text-white font-bold">13:00 — 00:30</p>
                  </div>
               </div>
            </div>
          </ScrollReveal>

          {/* Map Area */}
          <ScrollReveal direction="right" className="h-full min-h-[400px]">
            <div className="h-full rounded-3xl overflow-hidden relative group shadow-2xl border border-white/10">
               {/* Map Placeholder UI */}
               <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-900 flex items-center justify-center transition-transform duration-[20s] group-hover:scale-110">
                  <MapIcon size={80} className="text-gray-300 dark:text-zinc-800 animate-pulse" />
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
               </div>
               
               {/* Location Marker Simulation */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <div className="relative">
                     <div className="w-12 h-12 bg-[var(--theme-primary)] rounded-full animate-ping opacity-30 absolute -inset-0" />
                     <div className="w-8 h-8 bg-[var(--theme-primary)] rounded-full flex items-center justify-center text-white relative shadow-lg">
                        <MapPin size={20} />
                     </div>
                  </div>
               </div>

               {/* Interaction Overlay */}
               <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10 z-20">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || restaurant.name)}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-[var(--theme-primary)] text-white font-bold text-center rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    Cómo llegar (Waze / Google Maps)
                  </a>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
