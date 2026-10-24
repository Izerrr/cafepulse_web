'use client';

import React from 'react';
import { Coffee, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] text-[#71717A] text-xs">
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#E59850]">
                <Coffee className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[#EDEDED]">
                Cafe<span className="text-[#E59850]">Pulse</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#A1A1AA] max-w-md">
              Direktori kafe ramah kerja di Surakarta. Dibangun untuk memudahkan pekerja remote,
              mahasiswa, dan tim mencari ruang kerja dengan koneksi stabil dan colokan yang memadai.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#A1A1AA]">
                Surakarta Chapter
              </span>
              <span className="rounded border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#A1A1AA]">
                Supabase Connected
              </span>
            </div>
          </div>

          {/* Telemetri API */}
          <div className="space-y-2 md:col-span-4">
            <div className="font-medium text-[#D4D4D8]">
              Integrasi Backend
            </div>
            
            <ul className="space-y-1.5 text-xs text-[#A1A1AA]">
              <li className="flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-[#71717A]">REST API</span>
                <a
                  href="https://api.cafepulse.izerworks.my.id/db-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EDEDED] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  api.cafepulse.izerworks.my.id
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-[#71717A]">Database</span>
                <span className="text-[#EDEDED]">PostgreSQL (Supabase)</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-[#71717A]">Frontend</span>
                <span className="text-[#EDEDED] font-mono text-[11px]">cafepulse.izerworks.my.id</span>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col justify-between md:col-span-2 md:items-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-[#EDEDED] transition-colors hover:border-white/20"
            >
              <span>Ke Atas</span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
            </button>

            <span className="text-[11px] text-[#52525B] mt-4 md:mt-0 font-mono">
              V1.0 · 2026
            </span>
          </div>

        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-white/[0.06] bg-[#050507] py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-[11px] text-[#52525B]">
          <div>
            &copy; 2026 CafePulse. Direktori kafe ramah kerja.
          </div>
          <div>
            Surakarta, Indonesia
          </div>
        </div>
      </div>

    </footer>
  );
}
