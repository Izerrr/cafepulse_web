'use client';

import React from 'react';
import { Coffee, Plus, Bookmark, Code2 } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  totalBookmarks?: number;
  onFilterBookmarks?: () => void;
  isBookmarkActive?: boolean;
}

export default function Navbar({
  onOpenAddModal,
  totalBookmarks = 0,
  onFilterBookmarks,
  isBookmarkActive = false,
}: NavbarProps) {
  const scrollToApi = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('developer-api');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090B]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#E59850]">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-tight text-[#EDEDED]">
              Cafe<span className="text-[#E59850]">Pulse</span>
            </span>
            <span className="text-xs text-[#71717A] hidden sm:inline">
              / Surakarta
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Bookmark Quick Filter Pill */}
          {onFilterBookmarks && (
            <button
              onClick={onFilterBookmarks}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                isBookmarkActive
                  ? 'border-amber-500/50 bg-amber-500/10 text-[#E59850] font-medium'
                  : 'border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20 hover:text-white'
              }`}
              title="Lihat kafe yang kamu bookmark"
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarkActive ? 'fill-[#E59850]' : ''}`} />
              <span className="hidden xs:inline">Favorit</span>
              {totalBookmarks > 0 && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] font-mono">
                  {totalBookmarks}
                </span>
              )}
            </button>
          )}

          {/* Link to Open Data API */}
          <a
            href="#developer-api"
            onClick={scrollToApi}
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-[#A1A1AA] transition-colors hover:border-white/20 hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5 text-[#71717A]" />
            <span>API Terbuka</span>
          </a>

          {/* Add Cafe Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#EDEDED] px-3.5 py-1.5 text-xs font-medium text-[#09090B] transition-colors hover:bg-white active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Tambah Kafe</span>
          </button>

        </div>

      </div>
    </header>
  );
}
