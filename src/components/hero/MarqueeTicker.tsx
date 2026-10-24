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
    <div className="relative w-full overflow-hidden border-b border-[#111111]/8 bg-[#FAFAFC] py-3 text-xs text-[#666666]">
      {/* Side fades */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#FAFAFC] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#FAFAFC] to-transparent" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-[#0070F3]" />
              <span className="font-medium tracking-tight text-[#111111]">{item.label}</span>
              <span className="text-[#BBBBBB] ml-2">/</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
