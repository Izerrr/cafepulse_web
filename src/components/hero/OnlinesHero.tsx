'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, Code2, Coffee, Sparkles } from 'lucide-react';
import GrillaCeldas from './GrillaCeldas';
import AnimatedCursors from './AnimatedCursors';
import TypingCodeBlock from './TypingCodeBlock';

interface OnlinesHeroProps {
  onScrollToExplore: () => void;
  totalCafes?: number;
  onToggleFocusMode?: (isFocus: boolean) => void;
}

export default function OnlinesHero({
  onScrollToExplore,
  totalCafes = 2,
  onToggleFocusMode,
}: OnlinesHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocus = () => {
    const next = !isFocusMode;
    setIsFocusMode(next);
    onToggleFocusMode?.(next);
  };

  const scrollToApi = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('developer-api')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-white border-b border-[#111111]/10 select-none min-h-[750px] lg:min-h-[860px] flex flex-col justify-between"
    >
      {/* 1. Dotted Coordinate Grid with hover trail from onlines.com.ar */}
      <GrillaCeldas cellSize={55} highlightCount={14} />

      {/* 2. Collaborative Figma Cursors wandering the canvas */}
      <AnimatedCursors />

      {/* 3. Center Canvas & Floating Artifacts */}
      <div className="relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center py-12 lg:py-16">
        
        {/* =======================================================================
            FLOATING STUDIO ARTIFACTS (Exact onlines.com.ar placements)
           ======================================================================= */}

        {/* Top Left: Wireframe Blueprint */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, -8, 0],
            rotate: [5.8, 6.8, 5.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="hidden md:flex absolute top-10 left-6 lg:left-12 z-10 flex-col items-center gap-1.5 p-2 rounded-xl border border-[#111111]/10 bg-white/95 shadow-lg backdrop-blur-md"
        >
          <div className="relative w-44 h-32">
            <Image
              src="/onlines/wireframe.svg"
              alt="Floorplan Wireframe"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-mono text-[10px] text-[#71717A] tracking-tight">
            Denah &amp; Akses Meja
          </span>
        </motion.div>

        {/* Bottom Right: Live Code Typing Widget */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, 8, 0],
            rotate: [-5.9, -4.9, -5.9],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="hidden lg:flex absolute bottom-24 right-8 lg:right-16 z-10"
        >
          <TypingCodeBlock />
        </motion.div>

        {/* Figma Comment Bubble 1 (Top Right) */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="hidden sm:flex absolute top-12 right-6 lg:right-24 z-10 comentario-figma__burbuja"
        >
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden border border-black/10">
            <Image
              src="/onlines/onlines-avatar.svg"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#111111]">
              <strong className="font-semibold">Mahasiswa UNS</strong>
              <span className="text-[#888888]">baru saja</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-[#424242]">
              Wi-Fi 85 Mbps kencang &amp; stabil buat zoom meeting.
            </p>
          </div>
        </motion.div>

        {/* Figma Comment Bubble 2 (Bottom Left) */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="hidden md:flex absolute bottom-24 left-8 lg:left-20 z-10 comentario-figma__burbuja"
        >
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden border border-black/10">
            <Image
              src="/onlines/onlines-avatar.svg"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#111111]">
              <strong className="font-semibold">Remote Worker</strong>
              <span className="text-[#888888]">terverifikasi</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-[#424242]">
              Colokan ada di setiap meja, AC dingin &amp; kopinya enak.
            </p>
          </div>
        </motion.div>

        {/* Mode Switch Pill (Above Center Title) */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-6 z-10"
        >
          <button
            onClick={toggleFocus}
            className="onlines-switch-pill cursor-pointer hover:shadow-md transition-all active:scale-95"
            title="Beralih ke mode fokus (hanya tampilkan kafe sepi)"
          >
            <span className="font-sans text-xs font-semibold text-[#1D1D1F]">
              Mode Fokus (Sepi)
            </span>
            <div
              className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                isFocusMode ? 'bg-[#0070F3] justify-end' : 'bg-[#E5E5EA] justify-start'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </div>
          </button>
        </motion.div>

        {/* =======================================================================
            CENTER PIECE: DRAGGABLE TITLE & FIGMA SELECTION BOX
           ======================================================================= */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.12}
          whileHover={{ cursor: 'move' }}
          className="relative inline-flex items-center justify-center p-6 sm:p-10 select-none z-10"
        >
          {/* Dashed Selection Bounding Box */}
          <div className="home-hero__seleccion absolute inset-0">
            <span className="home-hero__handle home-hero__handle--tl" />
            <span className="home-hero__handle home-hero__handle--tc" />
            <span className="home-hero__handle home-hero__handle--tr" />
            <span className="home-hero__handle home-hero__handle--bl" />
            <span className="home-hero__handle home-hero__handle--bc" />
            <span className="home-hero__handle home-hero__handle--br" />
          </div>

          {/* Massive Display Title (Matching onlines.com.ar 'internet.') */}
          <h1 className="onlines-display-title">
            cafepulse<span className="text-[#0070F3]">.</span>
          </h1>
        </motion.div>

        {/* Floating App Badges */}
        <div className="hidden lg:block pointer-events-none" aria-hidden="true">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 left-[38%] w-12 h-12 rounded-xl bg-white/95 border border-black/10 shadow-md backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-grab"
          >
            <Image src="/onlines/app-vscode.svg" alt="VS Code" width="22" height="22" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 7, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-24 right-[34%] w-12 h-12 rounded-xl bg-white/95 border border-black/10 shadow-md backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-grab"
          >
            <Image src="/onlines/app-figma.webp" alt="Figma" width="18" height="22" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-28 left-[44%] w-12 h-12 rounded-xl bg-white/95 border border-black/10 shadow-md backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-grab"
          >
            <Coffee className="w-5 h-5 text-[#E08E45]" />
          </motion.div>
        </div>

        {/* Human Copywriting (FATISDA26-TaskPanel Style) */}
        <div className="mt-8 max-w-2xl text-center z-10">
          <p className="text-sm sm:text-base font-normal leading-relaxed text-[#424242]">
            Direktori kurasi kafe dan ruang kerja ramah laptop di Surakarta.
            Uji nyata throughput Wi-Fi, colokan listrik per meja, dan tingkat kebisingan lapangan.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onScrollToExplore}
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0070F3] active:scale-95"
            >
              <span>Jelajahi Direktori Kafe</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <a
              href="#developer-api"
              onClick={scrollToApi}
              className="inline-flex items-center gap-2 rounded-full border border-[#111111]/15 bg-white px-4 py-2.5 text-xs font-semibold text-[#111111] transition-all hover:border-[#111111]/30 hover:bg-[#F5F5F7] active:scale-95"
            >
              <Code2 className="h-3.5 w-3.5 text-[#0070F3]" />
              <span>Akses REST API</span>
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-[#888888]">
            <Sparkles className="h-3 w-3 text-[#0070F3]" />
            <span>Semua elemen kartu di atas dapat di-drag bebas</span>
            <span>&middot;</span>
            <span>{totalCafes} lokasi terverifikasi</span>
          </div>
        </div>

      </div>

    </section>
  );
}

