'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Coffee, Plus, Database, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export default function Navbar({ onOpenAddModal }: NavbarProps) {
  const { data: statusData, isLoading, isError } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => api.getSystemStatus(),
    refetchInterval: 25000,
  });

  const isConnected = !isLoading && !isError && statusData?.status === 'success';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#0B0908]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-gradient-to-b from-[#211B17] to-[#120F0D] text-[#E59850] shadow-sm">
            <Coffee className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-semibold tracking-tight text-[#F9F6F0]">
              Cafe<span className="text-[#E59850]">Pulse</span>
            </span>
            <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-[#A3988E] sm:inline-block">
              Surakarta
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Live Supabase Status Pill */}
          <div
            className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
              isConnected
                ? 'border-emerald-500/20 bg-emerald-500/[0.06] text-[#D5CCC2]'
                : isError
                ? 'border-red-500/20 bg-red-500/[0.06] text-red-300'
                : 'border-white/[0.08] bg-white/[0.02] text-[#A3988E]'
            }`}
            title="Database Connection Status"
          >
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected
                    ? 'animate-ping bg-emerald-400'
                    : isError
                    ? 'bg-red-400'
                    : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isConnected
                    ? 'bg-emerald-500'
                    : isError
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>

            <span className="font-medium">
              {isLoading
                ? 'Checking...'
                : isConnected
                ? 'Live Supabase'
                : 'Offline'}
            </span>

            {isConnected && statusData?.stats?.active_cafes !== undefined && (
              <span className="rounded-full bg-white/[0.06] px-1.5 py-0.2 text-[10px] font-medium text-[#E59850]">
                {statusData.stats.active_cafes} Spaces
              </span>
            )}

            {/* Hover Popover */}
            {isConnected && (
              <div className="pointer-events-none absolute right-0 top-full mt-2 hidden w-56 rounded-xl border border-white/[0.08] bg-[#14110E] p-3 text-left text-xs text-[#A3988E] shadow-2xl group-hover:block z-50">
                <div className="font-semibold text-[#F9F6F0] mb-1">Database Telemetry</div>
                <div className="text-emerald-400 text-[11px]">● {statusData?.database}</div>
                <div className="mt-1 text-[11px]">Active Nodes: <span className="text-[#F9F6F0] font-medium">{statusData?.stats?.active_cafes} verified</span></div>
              </div>
            )}
          </div>

          {/* Submit Cafe Action */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-full bg-[#E59850] px-4 py-1.5 text-xs font-semibold text-[#0B0908] transition-all hover:bg-[#F0A560] hover:shadow-[0_0_20px_-3px_rgba(229,152,80,0.35)] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Submit Space</span>
            <span className="xs:hidden">Add</span>
          </button>

        </div>

      </div>
    </header>
  );
}
