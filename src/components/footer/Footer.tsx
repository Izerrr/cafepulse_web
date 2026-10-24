'use client';

import React from 'react';
import { Coffee, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-canvas-border bg-canvas-surface text-roast-500 text-xs">
      
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Brand info */}
          <div className="space-y-3.5 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-canvas-border bg-white text-crema-500 shadow-xs">
                <Coffee className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold tracking-tight text-roast-900">
                cafepulse<span className="text-crema-500">.</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-roast-600 max-w-md">
              Direktori kurasi kafe ramah kerja di Surakarta. Dibangun untuk memudahkan pekerja remote,
              mahasiswa, dan tim mencari ruang kerja dengan koneksi stabil, colokan memadai, dan suasana kondusif.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="rounded-full border border-canvas-border bg-white px-3 py-0.5 text-roast-700">
                Surakarta Chapter
              </span>
              <span className="rounded-full border border-canvas-border bg-white px-3 py-0.5 text-roast-700">
                PostgreSQL (Supabase)
              </span>
              <span className="rounded-full border border-canvas-border bg-white px-3 py-0.5 text-roast-700">
                Next.js 16
              </span>
            </div>
          </div>

          {/* Telemetri & Integrasi API */}
          <div className="space-y-2 md:col-span-4">
            <div className="font-semibold text-roast-900">
              Infrastruktur &amp; Integrasi
            </div>
            
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between border-b border-canvas-border pb-2">
                <span className="text-roast-400">REST API</span>
                <a
                  href="https://api.cafepulse.izerworks.my.id/db-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-roast-900 hover:text-crema-500 flex items-center gap-1 font-mono text-[11px] font-medium"
                >
                  api.cafepulse.izerworks.my.id
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between border-b border-canvas-border pb-2">
                <span className="text-roast-400">Domain Frontend</span>
                <span className="text-roast-900 font-mono text-[11px] font-medium">
                  cafepulse.izerworks.my.id
                </span>
              </li>
              <li className="flex items-center justify-between border-b border-canvas-border pb-2">
                <span className="text-roast-400">Status Layanan</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Operasional Normal
                </span>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col justify-between md:col-span-2 md:items-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-4 py-2 text-xs font-semibold text-roast-900 transition-all hover:border-canvas-border-hover hover:bg-canvas-bg shadow-xs active:scale-95"
            >
              <span>Ke Atas</span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
            </button>

            <span className="text-[11px] text-roast-400 mt-6 md:mt-0 font-mono">
              V1.0 · 2026
            </span>
          </div>

        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-canvas-border bg-canvas-bg py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-[11px] font-mono text-roast-400">
          <div>
            &copy; 2026 cafepulse. Direktori ruang kerja dan kafe ramah laptop.
          </div>
          <div>
            Surakarta, Jawa Tengah
          </div>
        </div>
      </div>

    </footer>
  );
}
