'use client';

import React from 'react';
import { Coffee, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.06] bg-[#090807] text-[#A3988E]">
      
      {/* Upper Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/20 bg-gradient-to-b from-[#211B17] to-[#120F0D] text-[#E59850]">
                <Coffee className="h-4 w-4" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#F9F6F0]">
                Cafe<span className="text-[#E59850]">Pulse</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#D5CCC2] max-w-sm">
              The high-fidelity workspace index for remote professionals, founders, and students in Surakarta.
              Independently measured for true throughput, power access, and cognitive calm.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-[#E59850]">
                Surakarta Chapter
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-[#D5CCC2]">
                Supabase Connected
              </span>
            </div>
          </div>

          {/* Telemetry Links */}
          <div className="space-y-3 text-xs md:col-span-4">
            <div className="font-semibold text-[#F9F6F0]">
              System Telemetry
            </div>
            
            <ul className="space-y-2 text-[#D5CCC2]">
              <li className="flex items-center justify-between border-b border-white/[0.05] pb-1.5">
                <span className="text-[#A3988E]">REST API</span>
                <a
                  href="https://api.cafepulse.izerworks.my.id/db-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E59850] hover:underline flex items-center gap-1 font-medium"
                >
                  api.cafepulse.izerworks.my.id
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between border-b border-white/[0.05] pb-1.5">
                <span className="text-[#A3988E]">Database Engine</span>
                <span className="text-[#F9F6F0]">Supabase PostgreSQL</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/[0.05] pb-1.5">
                <span className="text-[#A3988E]">CORS Policy</span>
                <span className="text-emerald-400">Enabled (Wildcard)</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/[0.05] pb-1.5">
                <span className="text-[#A3988E]">Frontend Host</span>
                <span className="text-[#F9F6F0]">cafepulse.izerworks.my.id</span>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col justify-between text-xs md:col-span-3 md:items-end">
            <div>
              <div className="font-semibold text-[#F9F6F0]">
                CafePulse Studio
              </div>
              <p className="mt-1 text-[11px] text-[#A3988E]">
                Edition 2026 &middot; Production
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs text-[#F9F6F0] transition-all hover:border-amber-500/40 hover:text-[#E59850]"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-white/[0.05] bg-[#070605] py-4 text-xs text-[#6B6158]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div>
            &copy; 2026 CafePulse. All benchmarks independently audited.
          </div>
          <div className="flex items-center gap-3 text-[#A3988E]">
            <span>Crafted for focused work</span>
            <span>&middot;</span>
            <span>Surakarta</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
