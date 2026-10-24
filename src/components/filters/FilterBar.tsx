'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
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
    <div className="border-b border-[#2F2723] bg-[#141110]/95 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Search Input & Count Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Brutalist Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C9289]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="SEARCH BY CAFE NAME OR ADDRESS (E.G. SLAMET RIYADI, JEBRES)..."
              className="w-full border border-[#2F2723] bg-[#0F0D0C] py-2.5 pl-10 pr-10 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] placeholder-[#574B43] outline-none transition-colors focus:border-[#E08E45]"
            />
            {filters.search && (
              <button
                onClick={() => onChange((prev) => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9289] hover:text-[#F7F3EE]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Results Badge & Reset Button */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="border border-[#2F2723] bg-[#1C1816] px-3 py-2 font-['JetBrains_Mono'] text-xs font-bold text-[#E08E45]">
              [{totalResults} {totalResults === 1 ? 'SPACE' : 'SPACES'} MATCHED]
            </div>

            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 border border-[#2F2723] bg-[#161311] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#9C9289] transition-colors hover:border-[#E08E45] hover:text-[#F7F3EE]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RESET</span>
              </button>
            )}
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#2F2723]/60 font-['JetBrains_Mono'] text-xs">
          
          {/* Crowd Density Filter */}
          <span className="text-[#9C9289] uppercase text-[11px] font-bold mr-1">
            CROWD:
          </span>
          {(['ALL', 'LOW', 'MODERATE'] as const).map((density) => {
            const isActive = filters.crowdDensity === density;
            return (
              <button
                key={density}
                onClick={() =>
                  onChange((prev) => ({ ...prev, crowdDensity: density }))
                }
                className={`border px-2.5 py-1 transition-all ${
                  isActive
                    ? 'border-[#E08E45] bg-[#E08E45] font-bold text-[#0F0D0C]'
                    : 'border-[#2F2723] bg-[#161311] text-[#D8D0C7] hover:border-[#574B43]'
                }`}
              >
                {density === 'LOW' && '🟢 '}
                {density === 'MODERATE' && '🟡 '}
                {density}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-[#2F2723] mx-1 hidden sm:block" />

          {/* Wi-Fi Thresholds */}
          <span className="text-[#9C9289] uppercase text-[11px] font-bold mr-1">
            WI-FI:
          </span>
          {[
            { label: 'ANY SPEED', val: 0 },
            { label: '⚡ > 50 MBPS', val: 50 },
            { label: '🚀 > 80 MBPS', val: 80 },
          ].map((item) => {
            const isActive = filters.minWifiSpeed === item.val;
            return (
              <button
                key={item.val}
                onClick={() =>
                  onChange((prev) => ({ ...prev, minWifiSpeed: item.val }))
                }
                className={`border px-2.5 py-1 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-500 font-bold text-white'
                    : 'border-[#2F2723] bg-[#161311] text-[#D8D0C7] hover:border-[#574B43]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-[#2F2723] mx-1 hidden sm:block" />

          {/* Socket Availability */}
          <span className="text-[#9C9289] uppercase text-[11px] font-bold mr-1">
            SOCKETS:
          </span>
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                plugScore: prev.plugScore === 'PLENTY' ? 'ALL' : 'PLENTY',
              }))
            }
            className={`border px-2.5 py-1 transition-all ${
              filters.plugScore === 'PLENTY'
                ? 'border-[#E08E45] bg-[#E08E45] font-bold text-[#0F0D0C]'
                : 'border-[#2F2723] bg-[#161311] text-[#D8D0C7] hover:border-[#574B43]'
            }`}
          >
            🔌 PLENTY ONLY
          </button>

          {/* Noise level filter */}
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                noiseLevel: prev.noiseLevel === 'QUIET' ? 'ALL' : 'QUIET',
              }))
            }
            className={`border px-2.5 py-1 transition-all ${
              filters.noiseLevel === 'QUIET'
                ? 'border-emerald-500 bg-emerald-500 font-bold text-[#0F0D0C]'
                : 'border-[#2F2723] bg-[#161311] text-[#D8D0C7] hover:border-[#574B43]'
            }`}
          >
            🔇 QUIET ONLY
          </button>

          {/* AC / Outdoor / Prayer room amenities */}
          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, acOnly: !prev.acOnly }))
            }
            className={`border px-2.5 py-1 transition-all ${
              filters.acOnly
                ? 'border-[#E08E45] bg-[#1C1816] text-[#E08E45] font-bold'
                : 'border-[#2F2723] bg-[#161311] text-[#9C9289] hover:border-[#574B43]'
            }`}
          >
            ❄️ AC
          </button>

          <button
            onClick={() =>
              onChange((prev) => ({ ...prev, prayerRoomOnly: !prev.prayerRoomOnly }))
            }
            className={`border px-2.5 py-1 transition-all ${
              filters.prayerRoomOnly
                ? 'border-[#E08E45] bg-[#1C1816] text-[#E08E45] font-bold'
                : 'border-[#2F2723] bg-[#161311] text-[#9C9289] hover:border-[#574B43]'
            }`}
          >
            🕌 MUSHOLA
          </button>

        </div>

      </div>
    </div>
  );
}

