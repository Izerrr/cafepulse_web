'use client';

import React from 'react';
import { Coffee, ArrowUpRight, Terminal } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#2F2723] bg-[#0A0807] text-[#9C9289]">
      
      {/* Upper Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-[#E08E45] bg-[#1C1816]">
                <Coffee className="h-4 w-4 text-[#E08E45]" />
              </div>
              <span className="font-['Syne'] text-2xl font-extrabold uppercase tracking-tight text-[#F7F3EE]">
                CAFE<span className="text-[#E08E45]">PULSE</span>
              </span>
            </div>

            <p className="font-['Inter'] text-sm leading-relaxed text-[#D8D0C7] max-w-sm">
              The high-fidelity workspace index for remote workers, founders, and creatives.
              Crafted in editorial neo-brutalist styling inspired by racing engineering &amp; cafe culture.
            </p>

            <div className="flex flex-wrap gap-2 font-['JetBrains_Mono'] text-[11px]">
              <span className="border border-[#2F2723] bg-[#161311] px-2 py-0.5 text-[#E08E45]">
                [SURAKARTA INDEX]
              </span>
              <span className="border border-[#2F2723] bg-[#161311] px-2 py-0.5 text-[#F7F3EE]">
                [SUPABASE POWERED]
              </span>
            </div>
          </div>

          {/* Quick Telemetry & Endpoints */}
          <div className="space-y-3 font-['JetBrains_Mono'] text-xs md:col-span-4">
            <div className="font-['Syne'] text-sm font-bold uppercase tracking-wider text-[#F7F3EE]">
              SYSTEM TELEMETRY
            </div>
            
            <ul className="space-y-2 text-[#D8D0C7]">
              <li className="flex items-center justify-between border-b border-[#2F2723]/60 pb-1.5">
                <span className="text-[#9C9289]">REST API</span>
                <a
                  href="https://api.cafepulse.izerworks.my.id/db-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E08E45] hover:underline flex items-center gap-1"
                >
                  api.cafepulse.izerworks.my.id
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="flex items-center justify-between border-b border-[#2F2723]/60 pb-1.5">
                <span className="text-[#9C9289]">Database Engine</span>
                <span className="text-[#F7F3EE]">Supabase PostgreSQL</span>
              </li>
              <li className="flex items-center justify-between border-b border-[#2F2723]/60 pb-1.5">
                <span className="text-[#9C9289]">CORS Policy</span>
                <span className="text-emerald-400">ENABLED (ALL ORIGINS)</span>
              </li>
              <li className="flex items-center justify-between border-b border-[#2F2723]/60 pb-1.5">
                <span className="text-[#9C9289]">Frontend Domain</span>
                <span className="text-[#F7F3EE]">cafepulse.izerworks.my.id</span>
              </li>
            </ul>
          </div>

          {/* Back to top & Edition */}
          <div className="flex flex-col justify-between font-['JetBrains_Mono'] text-xs md:col-span-3 md:items-end">
            <div>
              <div className="font-['Syne'] text-sm font-bold uppercase tracking-wider text-[#F7F3EE]">
                EDITION 2026
              </div>
              <p className="mt-1 text-[11px] text-[#9C9289]">
                VERSION 1.0.4 — PROD BUILD
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 flex items-center gap-2 border border-[#2F2723] bg-[#161311] px-4 py-2 font-['JetBrains_Mono'] text-xs uppercase text-[#F7F3EE] transition-all hover:border-[#E08E45] hover:text-[#E08E45]"
            >
              <span>BACK TO TOP</span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2F2723] bg-[#080706] py-4 font-['JetBrains_Mono'] text-[11px] text-[#574B43]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div>
            &copy; 2026 CAFEPULSE WEB. ALL BENCHMARKS AUDITED INDEPENDENTLY.
          </div>
          <div className="flex items-center gap-4 text-[#9C9289]">
            <span>DESIGN × PERFORMANCE</span>
            <span>•</span>
            <span>LANDO NORRIS × CAFE AESTHETIC</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
