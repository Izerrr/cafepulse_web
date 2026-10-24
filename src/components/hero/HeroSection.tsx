'use client';

import React from 'react';
import { Wifi, PlugZap, Coffee, ArrowDown, Activity, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToExplore: () => void;
  totalCafes?: number;
}

export default function HeroSection({ onScrollToExplore, totalCafes = 2 }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#2F2723] bg-[#0F0D0C] pt-12 pb-16 lg:pt-16 lg:pb-20">
      
      {/* Background Ambient Grid Accent */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(#F7F3EE 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Micro-Tags */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#2F2723]/60 pb-4 font-['JetBrains_Mono'] text-xs text-[#9C9289]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-[#2F2723] bg-[#161311] px-2 py-0.5 font-bold text-[#E08E45]">
              [INDEX // 0271]
            </span>
            <span className="border border-[#2F2723] bg-[#161311] px-2 py-0.5 text-[#F7F3EE]">
              [LATENCY-FREE]
            </span>
            <span className="hidden border border-[#2F2723] bg-[#161311] px-2 py-0.5 text-[#F7F3EE] sm:inline-block">
              [CURATED ROASTS]
            </span>
            <span className="border border-[#2F2723] bg-[#161311] px-2 py-0.5 text-[#F7F3EE]">
              [PLENTY SOCKETS]
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#10B981] font-semibold">CROWD RADAR ACTIVE</span>
          </div>
        </div>

        {/* Massive Neo-Brutalist Editorial Headline */}
        <div className="mb-8 max-w-5xl">
          <h1 className="font-['Syne'] text-5xl font-extrabold uppercase leading-[0.92] tracking-tighter text-[#F7F3EE] sm:text-7xl md:text-8xl lg:text-9xl">
            FIND YOUR <span className="text-[#E08E45]">PULSE.</span>
            <br />
            <span className="text-[#9C9289] hover:text-[#F7F3EE] transition-colors">COFFEE</span> &amp; COWORKING.
          </h1>
          
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
            <p className="font-['Inter'] text-base leading-relaxed text-[#D8D0C7] sm:text-lg md:col-span-8">
              A brutally curated directory of work-optimized coffee sanctuaries in Surakarta.
              Zero guesswork on Wi-Fi speeds, socket access, or noisy environments.
              Engineered for software engineers, designers, founders, and deep-work practitioners.
            </p>

            <div className="flex items-center gap-3 md:col-span-4 md:justify-end">
              <button
                onClick={onScrollToExplore}
                className="group flex items-center gap-3 border border-[#E08E45] bg-[#1C1816] px-5 py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#F7F3EE] brutalist-shadow-amber transition-all hover:bg-[#E08E45] hover:text-[#0F0D0C] active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>EXPLORE WORKSPACES</span>
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Operational Spec Badges (Editorial Metric Row) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          
          <div className="border border-[#2F2723] bg-[#161311] p-4 transition-all hover:border-[#E08E45]/60 hover:bg-[#1C1816]">
            <div className="flex items-center justify-between text-[#9C9289]">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase">SPEED BENCHMARK</span>
              <Wifi className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#F7F3EE]">
              85+ <span className="text-sm font-normal text-[#9C9289] font-['JetBrains_Mono']">MBPS</span>
            </div>
            <p className="mt-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              Tested latency &lt; 15ms
            </p>
          </div>

          <div className="border border-[#2F2723] bg-[#161311] p-4 transition-all hover:border-[#E08E45]/60 hover:bg-[#1C1816]">
            <div className="flex items-center justify-between text-[#9C9289]">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase">POWER DENSITY</span>
              <PlugZap className="h-4 w-4 text-[#E08E45]" />
            </div>
            <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#E08E45]">
              PLENTY
            </div>
            <p className="mt-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              Sockets at every work desk
            </p>
          </div>

          <div className="border border-[#2F2723] bg-[#161311] p-4 transition-all hover:border-[#E08E45]/60 hover:bg-[#1C1816]">
            <div className="flex items-center justify-between text-[#9C9289]">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase">VERIFIED SPACES</span>
              <Coffee className="h-4 w-4 text-[#C86237]" />
            </div>
            <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#F7F3EE]">
              {totalCafes} <span className="text-sm font-normal text-[#9C9289] font-['JetBrains_Mono']">NODES</span>
            </div>
            <p className="mt-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              100% on-site verified
            </p>
          </div>

          <div className="border border-[#2F2723] bg-[#161311] p-4 transition-all hover:border-[#E08E45]/60 hover:bg-[#1C1816]">
            <div className="flex items-center justify-between text-[#9C9289]">
              <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase">CROWD DENSITY</span>
              <Activity className="h-4 w-4 text-[#10B981]" />
            </div>
            <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#10B981]">
              REALTIME
            </div>
            <p className="mt-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              Community telemetry pulse
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
