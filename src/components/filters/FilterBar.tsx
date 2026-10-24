'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { CrowdDensity, NoiseLevel, PlugScore } from '@/types/cafe';

export interface FilterState {
  search: string;
  crowdDensity: 'ALL' | CrowdDensity;
  minWifiSpeed: number; // 0, 50, 80
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
    <div className="border-b border-white/[0.06] bg-[#0E0C0B]/80 backdrop-blur-md p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Search Input & Count Header */}
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          
          {/* Sleek Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3988E]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search by cafe name or area (e.g. Slamet Riyadi, Jebres)..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#14110F] py-2.5 pl-10 pr-10 text-xs text-[#F9F6F0] placeholder-[#6B6158] outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
            />
            {filters.search && (
              <button
                onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3988E] hover:text-[#F9F6F0]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results Badge & Reset */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="rounded-full border border-amber-500/20 bg-amber-500/[0.07] px-3.5 py-1 text-xs font-medium text-[#E59850]">
              {totalResults} {totalResults === 1 ? 'space found' : 'spaces found'}
            </div>

            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-[#A3988E] transition-colors hover:border-amber-500/30 hover:text-[#F9F6F0]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.05] text-xs">
          
          <span className="text-[#A3988E] text-[11px] font-medium mr-1">
            Crowd:
          </span>
          {(['ALL', 'LOW', 'MODERATE'] as const).map((density) => {
            const isActive = filters.crowdDensity === density;
            return (
              <button
                key={density}
                onClick={() =>
                  onChange((prev) => ({ ...prev, crowdDensity: density }))
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E59850] text-[#0B0908] font-semibold'
                    : 'border border-white/[0.08] bg-white/[0.02] text-[#D5CCC2] hover:border-white/20'
                }`}
              >
                {density === 'LOW' && '🟢 Low'}
                {density === 'MODERATE' && '🟡 Moderate'}
                {density === 'ALL' && 'All'}
              </button>
            );
          })}

          <div className="h-3.5 w-[1px] bg-white/[0.08] mx-1 hidden sm:block" />

          {/* Wi-Fi Thresholds */}
          <span className="text-[#A3988E] text-[11px] font-medium mr-1">
            Wi-Fi:
          </span>
          {[
            { label: 'Any', val: 0 },
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white font-semibold shadow-sm'
                    : 'border border-white/[0.08] bg-white/[0.02] text-[#D5CCC2] hover:border-white/20'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-3.5 w-[1px] bg-white/[0.08] mx-1 hidden sm:block" />

          {/* Sockets */}
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                plugScore: prev.plugScore === 'PLENTY' ? 'ALL' : 'PLENTY',
              }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filters.plugScore === 'PLENTY'
                ? 'bg-[#E59850] text-[#0B0908] font-semibold'
                : 'border border-white/[0.08] bg-white/[0.02] text-[#D5CCC2] hover:border-white/20'
            }`}
          >
            🔌 Plenty Sockets
          </button>

          {/* Quiet Zone */}
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                noiseLevel: prev.noiseLevel === 'QUIET' ? 'ALL' : 'QUIET',
              }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filters.noiseLevel === 'QUIET'
                ? 'bg-emerald-500 text-[#0B0908] font-semibold'
                : 'border border-white/[0.08] bg-white/[0.02] text-[#D5CCC2] hover:border-white/20'
            }`}
          >
            🔇 Quiet Zone
          </button>

          {/* Amenities toggles */}
          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, acOnly: !prev.acOnly }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filters.acOnly
                ? 'border border-amber-500/50 bg-amber-500/10 text-[#E59850] font-semibold'
                : 'border border-white/[0.08] bg-white/[0.02] text-[#A3988E] hover:border-white/20'
            }`}
          >
            ❄️ AC
          </button>

          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, prayerRoomOnly: !prev.prayerRoomOnly }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filters.prayerRoomOnly
                ? 'border border-amber-500/50 bg-amber-500/10 text-[#E59850] font-semibold'
                : 'border border-white/[0.08] bg-white/[0.02] text-[#A3988E] hover:border-white/20'
            }`}
          >
            🕌 Mushola
          </button>

        </div>

      </div>
    </div>
  );
}
