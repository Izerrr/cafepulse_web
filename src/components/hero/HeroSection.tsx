'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Wifi, Plug, Coffee, MousePointer2, Move, Code2, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToExplore: () => void;
  totalCafes?: number;
}

export default function HeroSection({ onScrollToExplore, totalCafes = 2 }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToApi = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('developer-api');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#09090B] py-16 sm:py-24 select-none"
    >
      {/* onlines.com.ar coordinate canvas grid */}
      <div className="canvas-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            DRAGGABLE INTERACTIVE ARTIFACTS (onlines.com.ar Studio UX)
           ========================================================================= */}

        {/* 1. Draggable Wi-Fi Speed Widget */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.02, cursor: 'grab' }}
          whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 40 }}
          className="hidden md:flex absolute top-6 right-8 lg:right-16 z-20 items-center gap-2.5 rounded-xl border border-white/10 bg-[#141418]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-md"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Wifi className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#EDEDED]">
              <span>85 Mbps</span>
              <span className="text-[10px] text-emerald-400 font-normal">● 12ms</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#71717A]">
              <Move className="h-2.5 w-2.5" />
              <span>Tarik widget ini</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Draggable Micro Cafe Card */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.02, cursor: 'grab' }}
          whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 40 }}
          className="hidden lg:flex absolute bottom-8 left-4 z-20 items-center gap-3 rounded-xl border border-white/10 bg-[#141418]/90 p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E59850]/10 text-[#E59850]">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#EDEDED]">Ruang Temu Coffee</div>
            <div className="text-[10px] text-[#71717A] flex items-center gap-1.5">
              <span className="text-emerald-400">● Sepi (Fokus)</span>
              <span>·</span>
              <span>Jl. Slamet Riyadi</span>
            </div>
          </div>
          <Move className="h-3 w-3 text-[#52525B] ml-2" />
        </motion.div>

        {/* 3. Draggable Figma-Style Cursor Tags */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.15}
          whileDrag={{ scale: 1.05, zIndex: 40 }}
          className="hidden sm:flex items-center gap-1.5 absolute -top-2 left-16 z-20 cursor-grab active:cursor-grabbing"
        >
          <MousePointer2 className="h-4 w-4 fill-amber-500 text-amber-500 -rotate-45" />
          <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-mono font-medium text-[#09090B] shadow-sm">
            Mahasiswa UNS @ Jebres
          </span>
        </motion.div>

        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.15}
          whileDrag={{ scale: 1.05, zIndex: 40 }}
          className="hidden sm:flex items-center gap-1.5 absolute bottom-12 right-24 z-20 cursor-grab active:cursor-grabbing"
        >
          <MousePointer2 className="h-4 w-4 fill-blue-500 text-blue-500 -rotate-45" />
          <span className="rounded bg-blue-500 px-2 py-0.5 text-[10px] font-mono font-medium text-white shadow-sm">
            Remote Engineer
          </span>
        </motion.div>

        {/* =========================================================================
            HERO CANVAS SELECTION FRAME
           ========================================================================= */}
        <div className="relative mx-auto max-w-4xl pt-4 pb-2">
          
          <div className="canvas-selection-box p-6 sm:p-10 rounded-2xl bg-[#09090B]/60 backdrop-blur-sm">
            
            {/* 4 Corner Anchor Handles (onlines.com.ar signature element) */}
            <span className="canvas-handle canvas-handle-tl" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-tr" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-bl" aria-hidden="true" />
            <span className="canvas-handle canvas-handle-br" aria-hidden="true" />

            {/* Tag bar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-[#A1A1AA]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SURAKARTA · DIRECTORY
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#71717A]">
                <Sparkles className="h-3 w-3 text-[#E59850]" />
                Elemen di halaman ini bisa di-drag bebas
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-bold tracking-tight text-[#EDEDED] sm:text-5xl lg:text-6xl leading-[1.12]">
              Tempat kerja dan kopi di Surakarta.
              <br />
              <span className="text-[#A1A1AA] font-normal">
                Diverifikasi untuk kebutuhan kerja remote.
              </span>
            </h1>

            {/* Grounded Human Copywriting */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-[#A1A1AA]">
              Informasi kecepatan Wi-Fi nyata, ketersediaan colokan listrik di meja, dan tingkat kebisingan di setiap kafe.
              Dirancang agar kamu tidak lagi menebak-nebak sebelum memilih tempat untuk bekerja atau belajar.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onScrollToExplore}
                className="inline-flex items-center gap-2 rounded-lg bg-[#EDEDED] px-5 py-2.5 text-xs font-semibold text-[#09090B] transition-colors hover:bg-white active:scale-[0.98]"
              >
                <span>Lihat Daftar Kafe</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>

              <a
                href="#developer-api"
                onClick={scrollToApi}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:border-white/20 hover:text-white"
              >
                <Code2 className="h-3.5 w-3.5 text-[#71717A]" />
                <span>Dokumentasi API Terbuka</span>
              </a>

              <span className="text-xs text-[#71717A] font-mono ml-auto hidden sm:inline">
                {totalCafes} lokasi terdata
              </span>
            </div>

          </div>

        </div>

        {/* 3 Grounded Fact Cards */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-4xl mx-auto">
          
          <div className="rounded-xl border border-white/[0.08] bg-[#121215]/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Wifi className="h-3.5 w-3.5 text-blue-400" />
              <span>Internet &amp; Latensi</span>
            </div>
            <div className="mt-2 text-base font-semibold text-[#EDEDED]">
              Uji Kecepatan Riil
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Mencatat kecepatan unduh rata-rata dan kestabilan koneksi untuk panggilan video.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121215]/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Plug className="h-3.5 w-3.5 text-[#E59850]" />
              <span>Colokan Listrik</span>
            </div>
            <div className="mt-2 text-base font-semibold text-[#EDEDED]">
              Akses Daya per Meja
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Memastikan kamu tahu apakah colokan ada di setiap meja atau hanya di dinding tertentu.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#121215]/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Coffee className="h-3.5 w-3.5 text-emerald-400" />
              <span>Kenyamanan Ruang</span>
            </div>
            <div className="mt-2 text-base font-semibold text-[#EDEDED]">
              Tingkat Keramaian
            </div>
            <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
              Ketahui jam sepi, area ber-AC, ruang merokok terpisah, dan ketersediaan mushola.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
