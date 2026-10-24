'use client';

import React from 'react';
import { ArrowDown, Wifi, Plug, Coffee, MousePointer2 } from 'lucide-react';

interface HeroSectionProps {
  onScrollToExplore: () => void;
  totalCafes?: number;
}

export default function HeroSection({ onScrollToExplore, totalCafes = 2 }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#09090B] py-16 sm:py-24">
      
      {/* onlines.com.ar style coordinate grid */}
      <div className="canvas-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Onlines Figma Canvas Selection Frame */}
        <div className="relative mx-auto max-w-4xl pt-4 pb-2">
          
          {/* Floating Figma-style collaborative cursors */}
          <div className="hidden md:flex items-center gap-1.5 absolute -top-2 right-12 z-20 pointer-events-none">
            <MousePointer2 className="h-4 w-4 fill-blue-500 text-blue-500 -rotate-45" />
            <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-mono font-medium text-white shadow-sm">
              Wi-Fi 85 Mbps
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 absolute bottom-12 -left-6 z-20 pointer-events-none">
            <MousePointer2 className="h-4 w-4 fill-emerald-500 text-emerald-500 -rotate-45" />
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-mono font-medium text-white shadow-sm">
              Area Tenang
            </span>
          </div>

          {/* Canvas Dashed Selection Box Container */}
          <div className="canvas-selection-box p-6 sm:p-10 rounded-xl bg-[#09090B]/60 backdrop-blur-sm">
            
            {/* 4 Corner Anchor Handles (onlines.com.ar signature element) */}
            <span className="canvas-handle canvas-handle-tl" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-tr" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-bl" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-br" aria-hidden="true" />

            {/* Top Label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SURAKARTA · DIRECTORY V1.0
              </span>
            </div>

            {/* Professional Headline */}
            <h1 className="text-3xl font-bold tracking-tight text-[#EDEDED] sm:text-5xl lg:text-6xl leading-[1.12]">
              Tempat kerja dan kopi di Surakarta.
              <br />
              <span className="text-[#A1A1AA] font-normal">
                Diverifikasi untuk kebutuhan kerja remote.
              </span>
            </h1>

            {/* Professional, Non-AI-slop Description */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#A1A1AA]">
              Informasi kecepatan Wi-Fi nyata, ketersediaan colokan listrik di meja, dan tingkat kebisingan di setiap kafe.
              Dirancang agar kamu tidak lagi menebak-nebak sebelum memilih tempat untuk bekerja atau belajar.
            </p>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToExplore}
                className="inline-flex items-center gap-2 rounded-lg bg-[#EDEDED] px-5 py-2.5 text-xs font-semibold text-[#09090B] transition-colors hover:bg-white active:scale-[0.98]"
              >
                <span>Lihat Daftar Kafe</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>

              <span className="text-xs text-[#71717A] font-mono">
                {totalCafes} lokasi terverifikasi
              </span>
            </div>

          </div>

        </div>

        {/* 3 Grounded Fact Cards */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-4xl mx-auto">
          
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Wifi className="h-3.5 w-3.5 text-blue-400" />
              <span>Internet &amp; Latensi</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#EDEDED]">
              Uji Kecepatan Riil
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Mencatat kecepatan unduh rata-rata dan kestabilan koneksi untuk panggilan video.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Plug className="h-3.5 w-3.5 text-[#E59850]" />
              <span>Colokan Listrik</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#EDEDED]">
              Akses Daya per Meja
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Memastikan kamu tahu apakah colokan ada di setiap meja atau hanya di dinding tertentu.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Coffee className="h-3.5 w-3.5 text-emerald-400" />
              <span>Suasana &amp; Kenyamanan</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#EDEDED]">
              Tingkat Keramaian
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Ketahui jam sibuk, area ber-AC, ruang merokok terpisah, dan ketersediaan mushola.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
