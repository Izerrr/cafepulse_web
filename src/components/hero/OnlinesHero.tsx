'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, Coffee, Sparkles, Heart, Compass, BookOpen } from 'lucide-react';
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

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-canvas-bg border-b border-canvas-border select-none min-h-[750px] lg:min-h-[860px] flex flex-col justify-between"
    >
      {/* 1. Dotted Coordinate Grid with warm golden amber hover trail */}
      <GrillaCeldas cellSize={55} highlightCount={14} />

      {/* 2. Collaborative Figma Cursors (Penikmat Kopi, Teman Ngobrol, Mahasiswa, etc.) */}
      <AnimatedCursors />

      {/* 3. Center Canvas & Floating Welcoming Artifacts */}
      <div className="relative mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center py-12 lg:py-16">
        
        {/* =======================================================================
            FLOATING WELCOMING CAFE ARTIFACTS
           ======================================================================= */}

        {/* Top Left: Welcoming Coffee & Book Card */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, -8, 0],
            rotate: [3.5, 4.5, 3.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="hidden md:flex absolute top-12 left-6 lg:left-14 z-10 flex-col gap-2 p-3.5 rounded-2xl border border-canvas-border bg-white/95 shadow-md backdrop-blur-md max-w-[210px]"
        >
          <div className="flex items-center gap-2 text-crema-600">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-crema-100">
              <Coffee className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold text-roast-900">Ruang &amp; Kopi</span>
          </div>
          <p className="text-[11px] leading-relaxed text-roast-700">
            Kopi seduh segar, semilir angin sepoi, dan playlist lagu yang menenangkan hati.
          </p>
          <div className="flex items-center gap-1 text-[10px] font-mono text-roast-400 border-t border-canvas-border pt-1.5">
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            <span>Favorit warga Solo</span>
          </div>
        </motion.div>

        {/* Bottom Right: Live Recommendation Typewriter Widget */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.15}
          whileHover={{ scale: 1.03, cursor: 'grab' }}
          whileDrag={{ scale: 1.06, cursor: 'grabbing', zIndex: 40 }}
          animate={{
            y: [0, 8, 0],
            rotate: [-4.2, -3.2, -4.2],
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

        {/* Figma Comment Bubble 1 (Top Right: Review Mahasiswa) */}
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
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden border border-roast-900/10">
            <Image
              src="/onlines/onlines-avatar.svg"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-roast-900">
              <strong className="font-semibold text-crema-600">Dian Pramesti</strong>
              <span className="text-roast-400">pengunjung</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-roast-700">
              Enak banget buat ngobrol santai sore hari, suasananya syahdu dan gak bising.
            </p>
          </div>
        </motion.div>

        {/* Figma Comment Bubble 2 (Bottom Left: Review Penikmat Kopi) */}
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
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden border border-roast-900/10">
            <Image
              src="/onlines/onlines-avatar.svg"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-roast-900">
              <strong className="font-semibold text-crema-600">Reza Pratama</strong>
              <span className="text-roast-400">singgah</span>
            </div>
            <p className="font-sans text-[11px] leading-relaxed text-roast-700">
              Colokan aman di dekat jendela, AC dingin, kopinya pas banget di lidah.
            </p>
          </div>
        </motion.div>

        {/* Welcoming Mood Switch Pill (Above Center Title) */}
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
            title="Pilih antara suasana tenang untuk fokus atau semua kafe"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-roast-900">
                {isFocusMode ? '🌾 Suasana: Tenang & Teduh' : '☕ Suasana: Semua Pilihan Kafe'}
              </span>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-0.5 flex items-center transition-colors ${
                isFocusMode ? 'bg-crema-500 justify-end' : 'bg-roast-200 justify-start'
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
          {/* Dashed Selection Bounding Box with Warm Handles */}
          <div className="home-hero__seleccion absolute inset-0">
            <span className="home-hero__handle home-hero__handle--tl" />
            <span className="home-hero__handle home-hero__handle--tc" />
            <span className="home-hero__handle home-hero__handle--tr" />
            <span className="home-hero__handle home-hero__handle--bl" />
            <span className="home-hero__handle home-hero__handle--bc" />
            <span className="home-hero__handle home-hero__handle--br" />
          </div>

          {/* Massive Display Title with Warm Amber Dot */}
          <h1 className="onlines-display-title">
            cafepulse<span className="text-crema-500">.</span>
          </h1>
        </motion.div>

        {/* Floating Welcoming Badges (Coffee, Book, Nature) */}
        <div className="hidden lg:block pointer-events-none" aria-hidden="true">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-28 left-[38%] rounded-full bg-white/95 border border-canvas-border px-3.5 py-1.5 shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-auto cursor-grab text-xs font-semibold text-roast-850"
          >
            <span>☕</span>
            <span>Kopi Pilihan</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 7, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-24 right-[34%] rounded-full bg-white/95 border border-canvas-border px-3.5 py-1.5 shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-auto cursor-grab text-xs font-semibold text-roast-850"
          >
            <span>🌿</span>
            <span>Sudut Asri</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-28 left-[44%] rounded-full bg-white/95 border border-canvas-border px-3.5 py-1.5 shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-auto cursor-grab text-xs font-semibold text-roast-850"
          >
            <BookOpen className="w-3.5 h-3.5 text-crema-500" />
            <span>Nyaman Nugas</span>
          </motion.div>
        </div>

        {/* Human, Welcoming Copywriting for the General Public */}
        <div className="mt-8 max-w-2xl text-center z-10">
          <p className="text-sm sm:text-base font-normal leading-relaxed text-roast-700">
            Temukan sudut singgah ternyamanmu di Surakarta.
            Dari tempat ngobrol santai bersama sahabat, sudut teduh untuk membaca, hingga ruang tenang untuk menuntaskan skripsi dan pekerjaan.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onScrollToExplore}
              className="inline-flex items-center gap-2 rounded-full bg-roast-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-crema-500 active:scale-95"
            >
              <Compass className="h-3.5 w-3.5 text-crema-300" />
              <span>Jelajahi Sudut Kafe Solo</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={toggleFocus}
              className="inline-flex items-center gap-2 rounded-full border border-canvas-border bg-white px-4 py-2.5 text-xs font-semibold text-roast-900 transition-all hover:border-canvas-border-hover hover:bg-canvas-surface active:scale-95"
            >
              <Coffee className="h-3.5 w-3.5 text-crema-500" />
              <span>{isFocusMode ? 'Tampilkan Semua Kafe' : 'Cari yang Tenang'}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-roast-400">
            <Sparkles className="h-3 w-3 text-crema-500" />
            <span>Pilihan kafe terverifikasi langsung oleh komunitas Surakarta</span>
            <span>&middot;</span>
            <span>{totalCafes} lokasi siap dikunjungi</span>
          </div>
        </div>

      </div>

    </section>
  );
}
