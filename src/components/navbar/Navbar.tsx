'use client';

import React from 'react';
import { Coffee, Bookmark, Code2, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  totalBookmarks?: number;
  isBookmarkActive?: boolean;
  onFilterBookmarks?: () => void;
}

export default function Navbar({
  onOpenAddModal,
  totalBookmarks = 0,
  isBookmarkActive = false,
  onFilterBookmarks,
}: NavbarProps) {
  const scrollToApi = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('developer-api')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#111111]/8 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#111111]/10 bg-[#F5F5F7] text-[#0070F3]">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-[#111111]">
              cafepulse<span className="text-[#0070F3]">.</span>
            </span>
            <span className="text-xs font-mono text-[#888888] hidden sm:inline">
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
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isBookmarkActive
                  ? 'border-[#0070F3] bg-[#0070F3]/10 text-[#0070F3] font-semibold'
                  : 'border-[#111111]/10 bg-white text-[#555555] hover:border-[#111111]/25 hover:text-[#111111]'
              }`}
              title="Lihat kafe yang kamu simpan"
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarkActive ? 'fill-[#0070F3]' : ''}`} />
              <span className="hidden xs:inline">Favorit</span>
              {totalBookmarks > 0 && (
                <span className="rounded-full bg-[#111111]/8 px-1.5 py-0.2 text-[10px] font-mono font-medium">
                  {totalBookmarks}
                </span>
              )}
            </button>
          )}

          {/* Link to Open Data API */}
          <a
            href="#developer-api"
            onClick={scrollToApi}
            className="hidden md:flex items-center gap-1.5 rounded-full border border-[#111111]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#555555] transition-colors hover:border-[#111111]/25 hover:text-[#111111]"
          >
            <Code2 className="h-3.5 w-3.5 text-[#0070F3]" />
            <span>API Terbuka</span>
          </a>

          {/* Add Cafe Button (Onlines Pill Style) */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#0070F3] active:scale-95 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Tambah Kafe</span>
          </button>

        </div>

      </div>
    </header>
  );
}
