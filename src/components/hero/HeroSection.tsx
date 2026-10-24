'use client';

import React from 'react';
import { Wifi, PlugZap, Coffee, ArrowDown, Activity, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToExplore: () => void;
  totalCafes?: number;
}

export default function HeroSection({ onScrollToExplore, totalCafes = 2 }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B0908] pt-14 pb-16 lg:pt-20 lg:pb-24">
      
      {/* Subtle ambient warm glow in background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#E59850]/[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Delicate Pill Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-1 text-xs text-[#E59850]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">Curated Workspaces &middot; Surakarta Chapter</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-[#A3988E]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Crowd Radar Active</span>
          </div>
        </div>

        {/* Elegant Editorial Headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-[#F9F6F0] sm:text-6xl lg:text-7xl leading-[1.08]">
            Find your workspace rhythm.
            <br />
            <span className="bg-gradient-to-r from-[#E59850] to-[#F59E0B] bg-clip-text text-transparent">
              Coffee &amp; deep work
            </span>{' '}
            sanctuaries.
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#D5CCC2]">
            An independently audited index for software engineers, designers, and remote professionals.
            Zero guesswork on real Wi-Fi throughput, power outlet availability, or acoustic distractions.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onScrollToExplore}
              className="inline-flex items-center gap-2 rounded-full bg-[#E59850] px-6 py-3 text-sm font-semibold text-[#0B0908] transition-all hover:bg-[#F0A560] hover:shadow-[0_0_25px_-5px_rgba(229,152,80,0.4)] active:scale-[0.98]"
            >
              <span>Explore Workspaces</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            <span className="text-xs text-[#A3988E]">
              {totalCafes} verified spaces available in Solo
            </span>
          </div>
        </div>

        {/* Elegant 4-Box Metric Row */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between text-[#A3988E]">
              <span className="text-xs font-medium">Wi-Fi Benchmark</span>
              <Wifi className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-[#F9F6F0]">
              85+ <span className="text-xs font-normal text-[#A3988E]">Mbps</span>
            </div>
            <p className="mt-1 text-xs text-[#A3988E]">Audited low latency</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between text-[#A3988E]">
              <span className="text-xs font-medium">Power Density</span>
              <PlugZap className="h-4 w-4 text-[#E59850]" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-[#E59850]">
              Plenty
            </div>
            <p className="mt-1 text-xs text-[#A3988E]">Outlets at dedicated desks</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between text-[#A3988E]">
              <span className="text-xs font-medium">Verified Spaces</span>
              <Coffee className="h-4 w-4 text-[#C86237]" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-[#F9F6F0]">
              {totalCafes} <span className="text-xs font-normal text-[#A3988E]">Spaces</span>
            </div>
            <p className="mt-1 text-xs text-[#A3988E]">On-site tested</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all hover:border-amber-500/30 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between text-[#A3988E]">
              <span className="text-xs font-medium">Crowd Radar</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-emerald-400">
              Live
            </div>
            <p className="mt-1 text-xs text-[#A3988E]">Community telemetry</p>
          </div>

        </div>

      </div>
    </section>
  );
}
