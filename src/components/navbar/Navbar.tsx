'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Coffee, Plus, Database, Sparkles, AlertCircle } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export default function Navbar({ onOpenAddModal }: NavbarProps) {
  const { data: statusData, isLoading, isError } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => api.getSystemStatus(),
    refetchInterval: 20000,
  });

  const isConnected = !isLoading && !isError && statusData?.status === 'success';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2F2723] bg-[#0F0D0C]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Chapter Tag */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-none border border-[#E08E45] bg-[#1C1816] brutalist-shadow-amber transition-transform hover:-translate-y-0.5">
            <Coffee className="h-5 w-5 text-[#E08E45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Syne'] text-xl font-extrabold tracking-tight text-[#F7F3EE] uppercase sm:text-2xl">
                CAFE<span className="text-[#E08E45]">PULSE</span>
              </span>
              <span className="hidden rounded border border-[#2F2723] bg-[#1C1816] px-1.5 py-0.5 font-['JetBrains_Mono'] text-[10px] font-semibold tracking-wider text-[#9C9289] uppercase sm:inline-block">
                EDITION 2026
              </span>
            </div>
            <p className="hidden font-['JetBrains_Mono'] text-[11px] text-[#9C9289] md:block">
              SURAKARTA CHAPTER // WORK-READY SPACES
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Supabase / Backend System Status Pill */}
          <div
            className={`group relative flex items-center gap-2 border px-3 py-1.5 text-xs font-['JetBrains_Mono'] transition-all ${
              isConnected
                ? 'border-[#2F2723] bg-[#161311] text-[#D8D0C7]'
                : isError
                ? 'border-red-900/50 bg-red-950/20 text-red-400'
                : 'border-[#2F2723] bg-[#161311] text-[#9C9289]'
            }`}
            title="Real-time backend status"
          >
            <div className="relative flex h-2 w-2 items-center justify-center">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected
                    ? 'animate-ping bg-[#10B981]'
                    : isError
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isConnected
                    ? 'bg-[#10B981]'
                    : isError
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-[#E08E45]" />
              <span className="hidden font-semibold uppercase sm:inline">
                {isLoading
                  ? 'CHECKING DB...'
                  : isConnected
                  ? 'SUPABASE LIVE'
                  : 'BACKEND OFFLINE'}
              </span>
              <span className="font-semibold uppercase sm:hidden">
                {isConnected ? 'LIVE' : 'SYNCING'}
              </span>
              {isConnected && statusData?.stats?.active_cafes !== undefined && (
                <span className="rounded bg-[#2F2723] px-1 text-[10px] text-[#E08E45]">
                  {statusData.stats.active_cafes} NODES
                </span>
              )}
            </div>

            {/* Hover Tooltip Details */}
            {isConnected && (
              <div className="pointer-events-none absolute right-0 top-full mt-2 hidden w-56 border border-[#2F2723] bg-[#1C1816] p-2.5 text-left text-[11px] text-[#9C9289] shadow-xl group-hover:block z-50">
                <div className="font-bold text-[#F7F3EE] mb-1">Database Health</div>
                <div className="text-emerald-400">● {statusData?.database}</div>
                <div className="mt-1">Schema: <span className="text-[#E08E45]">{statusData?.schema}</span></div>
                <div>Active Workspaces: <span className="text-[#F7F3EE]">{statusData?.stats?.active_cafes} verified</span></div>
              </div>
            )}
          </div>

          {/* Add Space Action CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 border border-[#E08E45] bg-[#E08E45] px-3 py-1.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#0F0D0C] transition-all hover:bg-[#F59E0B] hover:shadow-[3px_3px_0px_#C86237] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">SUBMIT SPACE</span>
            <span className="xs:hidden">SUBMIT</span>
          </button>

        </div>

      </div>
    </header>
  );
}

