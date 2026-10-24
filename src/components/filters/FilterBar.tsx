'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { CrowdDensity, NoiseLevel, PlugScore } from '@/types/cafe';

export interface FilterState {
  search: string;
  crowdDensity: 'ALL' | CrowdDensity;
  minWifiSpeed: number;
  plugScore: 'ALL' | PlugScore;
  noiseLevel: 'ALL' | NoiseLevel;
  acOnly: boolean;
  outdoorOnly: boolean;
  prayerRoomOnly: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export default function FilterBar({
  filters,
  onChange,
  onReset,
  totalResults,
}: FilterBarProps) {
  const isFiltered =
    filters.search !== '' ||
    filters.crowdDensity !== 'ALL' ||
    filters.minWifiSpeed > 0 ||
    filters.plugScore !== 'ALL' ||
    filters.noiseLevel !== 'ALL' ||
    filters.acOnly ||
    filters.outdoorOnly ||
    filters.prayerRoomOnly;

  return (
    <div className="border-b border-white/[0.08] bg-[#0E0E11]/80 backdrop-blur-md p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Search bar & results count */}
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Cari nama kafe atau area (misal: Slamet Riyadi, Jebres)..."
              className="w-full rounded-lg border border-white/10 bg-[#18181B] py-2 pl-9 pr-9 text-xs text-[#EDEDED] placeholder-[#71717A] outline-none transition-all focus:border-white/20 focus:ring-1 focus:ring-white/20"
            />
            {filters.search && (
              <button
                onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#EDEDED]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-mono text-[#A1A1AA]">
              Menampilkan {totalResults} kafe
            </span>

            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-[#A1A1AA] transition-colors hover:border-white/20 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

        </div>

        {/* Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06] text-xs">
          
          <span className="text-[#71717A] text-[11px] font-medium mr-1">
            Keramaian:
          </span>
          {(['ALL', 'LOW', 'MODERATE'] as const).map((density) => {
            const isActive = filters.crowdDensity === density;
            return (
              <button
                key={density}
                onClick={() =>
                  onChange((prev) => ({ ...prev, crowdDensity: density }))
                }
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EDEDED] text-[#09090B]'
                    : 'border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20'
                }`}
              >
                {density === 'LOW' && '🟢 Sepi'}
                {density === 'MODERATE' && '🟡 Sedang'}
                {density === 'ALL' && 'Semua'}
              </button>
            );
          })}

          <div className="h-3.5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Wi-Fi Speeds */}
          <span className="text-[#71717A] text-[11px] font-medium mr-1">
            Wi-Fi:
          </span>
          {[
            { label: 'Semua', val: 0 },
            { label: '⚡ > 50 Mbps', val: 50 },
            { label: '🚀 > 80 Mbps', val: 80 },
          ].map((item) => {
            const isActive = filters.minWifiSpeed === item.val;
            return (
              <button
                key={item.val}
                onClick={() =>
                  onChange((prev) => ({ ...prev, minWifiSpeed: item.val }))
                }
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white font-medium'
                    : 'border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-3.5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Plug Score */}
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                plugScore: prev.plugScore === 'PLENTY' ? 'ALL' : 'PLENTY',
              }))
            }
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filters.plugScore === 'PLENTY'
                ? 'bg-[#E59850] text-[#09090B] font-medium'
                : 'border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20'
            }`}
          >
            🔌 Banyak Colokan
          </button>

          {/* Noise level */}
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                noiseLevel: prev.noiseLevel === 'QUIET' ? 'ALL' : 'QUIET',
              }))
            }
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filters.noiseLevel === 'QUIET'
                ? 'bg-emerald-500 text-[#09090B] font-medium'
                : 'border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20'
            }`}
          >
            🔇 Ruang Tenang
          </button>

          {/* Facilities */}
          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, acOnly: !prev.acOnly }))
            }
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filters.acOnly
                ? 'border border-white/30 bg-white/[0.08] text-[#EDEDED]'
                : 'border border-white/10 bg-white/[0.02] text-[#71717A] hover:border-white/20'
            }`}
          >
            ❄️ AC
          </button>

          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, prayerRoomOnly: !prev.prayerRoomOnly }))
            }
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filters.prayerRoomOnly
                ? 'border border-white/30 bg-white/[0.08] text-[#EDEDED]'
                : 'border border-white/10 bg-white/[0.02] text-[#71717A] hover:border-white/20'
            }`}
          >
            🕌 Mushola
          </button>

        </div>

      </div>
    </div>
  );
}
