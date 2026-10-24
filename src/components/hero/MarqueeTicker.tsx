'use client';

import React from 'react';
import { Zap, Plug, Coffee, Volume2, ShieldCheck, MapPin, Laptop, Activity } from 'lucide-react';

export default function MarqueeTicker() {
  const tickerItems = [
    { icon: Zap, label: 'Verified 100+ Mbps Wi-Fi' },
    { icon: Plug, label: 'Dedicated Desk Sockets' },
    { icon: Coffee, label: 'Specialty Coffee & Brews' },
    { icon: Volume2, label: 'Acoustics & Quiet Zones' },
    { icon: ShieldCheck, label: 'Audited Workspaces' },
    { icon: MapPin, label: 'Surakarta & Solo Raya' },
    { icon: Laptop, label: 'Remote-Ready Standard' },
    { icon: Activity, label: 'Realtime Crowd Pulse' },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.06] bg-[#0E0C0B]/60 py-2.5 text-xs text-[#D5CCC2] backdrop-blur-md">
      {/* Side Fade Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0B0908] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0B0908] to-transparent" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-[#E59850]" />
              <span className="font-medium tracking-tight">{item.label}</span>
              <span className="text-white/20 ml-2">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
