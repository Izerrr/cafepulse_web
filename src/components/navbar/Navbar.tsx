'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Coffee, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export default function Navbar({ onOpenAddModal }: NavbarProps) {
  const { data: statusData, isLoading, isError } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => api.getSystemStatus(),
    refetchInterval: 30000,
  });

  const isConnected = !isLoading && !isError && statusData?.status === 'success';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090B]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
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

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Supabase status indicator */}
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-[#A1A1AA]">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'animate-ping bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="hidden xs:inline">
              {isLoading ? 'Menghubungkan...' : isConnected ? 'Terkoneksi ke Database' : 'Offline'}
            </span>
            {isConnected && statusData?.stats?.active_cafes !== undefined && (
              <span className="text-[#71717A] font-mono text-[11px]">
                ({statusData.stats.active_cafes} kafe)
              </span>
            )}
          </div>

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
