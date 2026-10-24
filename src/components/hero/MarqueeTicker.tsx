'use client';

import React from 'react';
import { Zap, Plug, Coffee, VolumeX, BatteryCharging, MapPin, Laptop, Activity } from 'lucide-react';

export default function MarqueeTicker() {
  const tickerItems = [
    { icon: Zap, label: 'VERIFIED 100+ MBPS WI-FI', color: 'text-blue-400' },
    { icon: Plug, label: 'PLUG CAPACITY CHECKED', color: 'text-[#E08E45]' },
    { icon: Coffee, label: 'SINGLE ORIGIN BREWS', color: 'text-[#C86237]' },
    { icon: VolumeX, label: 'NOISE LEVEL CONTROLLED', color: 'text-emerald-400' },
    { icon: BatteryCharging, label: 'DEDICATED WORKSTATIONS', color: 'text-amber-400' },
    { icon: MapPin, label: 'SURAKARTA & BEYOND', color: 'text-purple-400' },
    { icon: Laptop, label: 'REMOTE WORK READY', color: 'text-blue-400' },
    { icon: Activity, label: 'REALTIME CROWD PULSE', color: 'text-emerald-400' },
  ];

  return (
    <div className="relative w-full overflow-hidden border-y border-[#2F2723] bg-[#161311] py-2.5 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#F7F3EE]">
      {/* Visual gradients for smooth side fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#161311] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#161311] to-transparent" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render 2 duplicates to create seamless infinite loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2">
              <Icon className={`h-3.5 w-3.5 ${item.color}`} />
              <span className="font-bold">{item.label}</span>
              <span className="text-[#574B43]">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
