'use client';

import React from 'react';
import { Coffee, Heart, Smile, Sparkles, MapPin, Wifi, Plug, Compass } from 'lucide-react';

export default function MarqueeTicker() {
  const tickerItems = [
    { icon: Coffee, label: 'Kopi Seduh Segar & Pilihan Minuman' },
    { icon: Smile, label: 'Suasana Nyaman untuk Singgah' },
    { icon: Sparkles, label: 'Sudut Asri Melepas Penat' },
    { icon: Plug, label: 'Stopkontak Siap Pakai di Meja' },
    { icon: Wifi, label: 'Koneksi Wi-Fi Stabil & Cepat' },
    { icon: Heart, label: 'Ramah untuk Kumpul Bersama Kawan' },
    { icon: Compass, label: 'Rekomendasi Terkurasi di Kota Solo' },
    { icon: MapPin, label: 'Kawasan Surakarta & Sekitarnya' },
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-canvas-border bg-canvas-surface py-3 text-xs text-roast-600">
      {/* Side fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-canvas-surface to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-canvas-surface to-transparent" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-crema-500" />
              <span className="font-medium tracking-tight text-roast-900">{item.label}</span>
              <span className="text-roast-300 ml-2">/</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
