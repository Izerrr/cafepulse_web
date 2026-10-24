'use client';

import React from 'react';
import { Zap, Plug, Coffee, Volume2, ShieldCheck, MapPin, Laptop, Activity } from 'lucide-react';

export default function MarqueeTicker() {
  const tickerItems = [
    { icon: Zap, label: 'Uji Kecepatan Wi-Fi 50+ Mbps' },
    { icon: Plug, label: 'Colokan Tersedia di Meja' },
    { icon: Coffee, label: 'Kopi & Menu Pendamping' },
    { icon: Volume2, label: 'Area Tenang untuk Bekerja' },
    { icon: ShieldCheck, label: 'Data Terverifikasi Lapangan' },
    { icon: MapPin, label: 'Kawasan Surakarta & Sekitarnya' },
    { icon: Laptop, label: 'Ramah Laptop & Kerja Remote' },
    { icon: Activity, label: 'Pantauan Keramaian Kafe' },
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-white/[0.08] bg-[#09090B] py-2.5 text-xs text-[#A1A1AA]">
      {/* Side fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#09090B] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#09090B] to-transparent" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-[#E59850]" />
              <span className="font-medium tracking-tight text-[#D4D4D8]">{item.label}</span>
              <span className="text-[#3F3F46] ml-2">/</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
