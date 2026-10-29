'use client';

import React from 'react';
import { Coffee, Bookmark, Code2, Plus, ShieldCheck, User, Map } from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';

interface NavbarProps {
  onOpenAddModal: () => void;
  totalBookmarks?: number;
  isBookmarkActive?: boolean;
  onFilterBookmarks?: () => void;
  userRole?: UserRole;
  onOpenAccessModal?: () => void;
  onOpenMapView?: () => void;
}

export default function Navbar({
  onOpenAddModal,
  totalBookmarks = 0,
  isBookmarkActive = false,
  onFilterBookmarks,
  userRole = 'visitor',
  onOpenAccessModal,
  onOpenMapView,
}: NavbarProps) {
  const scrollToApi = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('developer-api')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-canvas-border bg-canvas-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-canvas-border bg-canvas-surface text-crema-500 shadow-xs">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-roast-900">
              cafepulse<span className="text-crema-500">.</span>
            </span>
            <span className="text-xs font-mono text-roast-400 hidden sm:inline">
              / Panduan Kafe Solo
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Interactive Map Quick Button */}
          {onOpenMapView && (
            <button
              onClick={onOpenMapView}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-3 py-1.5 text-xs font-medium text-roast-700 transition-colors hover:border-crema-500 hover:text-crema-600"
              title="Buka Peta Radar Kafe Solo"
            >
              <Map className="h-3.5 w-3.5 text-crema-500" />
              <span>Peta Solo</span>
            </button>
          )}

          {/* Bookmark Quick Filter Pill */}
          {onFilterBookmarks && (
            <button
              onClick={onFilterBookmarks}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isBookmarkActive
                  ? 'border-crema-500 bg-crema-50 text-crema-500 font-semibold'
                  : 'border-canvas-border bg-white text-roast-600 hover:border-canvas-border-hover hover:text-roast-900'
              }`}
              title="Lihat kafe yang kamu simpan"
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarkActive ? 'fill-crema-500' : ''}`} />
              <span className="hidden md:inline">Tersimpan</span>
              {totalBookmarks > 0 && (
                <span className="rounded-full bg-roast-900/8 px-1.5 py-0.2 text-[10px] font-mono font-medium text-roast-700">
                  {totalBookmarks}
                </span>
              )}
            </button>
          )}

          {/* User Role / Access Mode Button */}
          {onOpenAccessModal && (
            <button
              onClick={onOpenAccessModal}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                userRole === 'curator' || userRole === 'staff'
                  ? 'border-crema-500 bg-crema-500/10 text-crema-600 font-bold'
                  : 'border-canvas-border bg-white text-roast-600 hover:border-canvas-border-hover hover:text-roast-900'
              }`}
              title="Pengaturan Kelas Pengguna (Pengunjung / Staff Kafe / Kurator)"
            >
              {userRole === 'curator' ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-crema-500" />
                  <span className="hidden sm:inline">Mode Kurator / Dev</span>
                </>
              ) : userRole === 'staff' ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Mode Staff Kafe</span>
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-status-green" />
                  <span className="hidden sm:inline">Akses: Pengunjung</span>
                </>
              )}
            </button>
          )}

          {/* Link to Open Data API */}
          <a
            href="#developer-api"
            onClick={scrollToApi}
            className="hidden lg:flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-3 py-1.5 text-xs font-medium text-roast-500 transition-colors hover:border-canvas-border-hover hover:text-roast-900"
          >
            <Code2 className="h-3.5 w-3.5 text-crema-500" />
            <span>API Publik</span>
          </a>

          {/* Add Cafe Button (Warm & Welcoming) */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-full bg-roast-900 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-crema-500 active:scale-95 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Tambah Kafe</span>
          </button>
        </div>
      </div>
    </header>
  );
}
