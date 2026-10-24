'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { FilterState } from '@/types/cafe';

interface FilterBarProps {
  filters: FilterState;
  onChange: React.Dispatch<React.SetStateAction<FilterState>>;
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
    <div className="border-b border-[#111111]/8 bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Search bar & results count */}
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev: FilterState) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Cari nama kafe atau area (misal: Slamet Riyadi, Jebres, UNS)..."
              className="w-full rounded-full border border-[#111111]/10 bg-[#F5F5F7] py-2.5 pl-10 pr-9 text-xs text-[#111111] placeholder-[#888888] outline-none transition-all focus:border-[#0070F3] focus:ring-1 focus:ring-[#0070F3]/30"
            />
            {filters.search && (
              <button
                onClick={() => onChange((prev: FilterState) => ({ ...prev, search: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-mono font-medium text-[#71717A]">
              Menampilkan {totalResults} lokasi terverifikasi
            </span>

            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-full border border-[#111111]/10 bg-white px-3.5 py-1.5 text-xs font-medium text-[#424242] transition-colors hover:border-[#111111]/30 hover:text-[#111111]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

        </div>

        {/* Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3.5 border-t border-[#111111]/8 text-xs">
          
          <span className="text-[#888888] text-[11px] font-mono mr-1">
            Keramaian:
          </span>
          {(['ALL', 'LOW', 'MODERATE'] as const).map((density) => {
            const isActive = filters.crowdDensity === density;
            return (
              <button
                key={density}
                onClick={() =>
                  onChange((prev: FilterState) => ({ ...prev, crowdDensity: density }))
                }
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'border border-[#111111]/10 bg-[#F5F5F7] text-[#424242] hover:border-[#111111]/25'
                }`}
              >
                {density === 'LOW' && '🟢 Sepi (Fokus)'}
                {density === 'MODERATE' && '🟡 Sedang'}
                {density === 'ALL' && 'Semua'}
              </button>
            );
          })}

          <div className="h-4 w-px bg-[#111111]/10 mx-1 hidden sm:block" />

          {/* Wi-Fi Speeds */}
          <span className="text-[#888888] text-[11px] font-mono mr-1">
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
                  onChange((prev: FilterState) => ({ ...prev, minWifiSpeed: item.val }))
                }
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#0070F3] text-white font-semibold'
                    : 'border border-[#111111]/10 bg-[#F5F5F7] text-[#424242] hover:border-[#111111]/25'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-4 w-px bg-[#111111]/10 mx-1 hidden sm:block" />

          {/* Plug Score */}
          <button
            onClick={() =>
              onChange((prev: FilterState) => ({
                ...prev,
                plugScore: prev.plugScore === 'PLENTY' ? 'ALL' : 'PLENTY',
              }))
            }
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              filters.plugScore === 'PLENTY'
                ? 'bg-[#E08E45] text-white'
                : 'border border-[#111111]/10 bg-[#F5F5F7] text-[#424242] hover:border-[#111111]/25'
            }`}
          >
            🔌 Banyak Colokan
          </button>

          {/* Noise level */}
          <button
            onClick={() =>
              onChange((prev: FilterState) => ({
                ...prev,
                noiseLevel: prev.noiseLevel === 'QUIET' ? 'ALL' : 'QUIET',
              }))
            }
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              filters.noiseLevel === 'QUIET'
                ? 'bg-[#10B981] text-white'
                : 'border border-[#111111]/10 bg-[#F5F5F7] text-[#424242] hover:border-[#111111]/25'
            }`}
          >
            🔇 Ruang Tenang
          </button>

          {/* Facilities */}
          <button
            onClick={() =>
              onChange((prev: FilterState) => ({ ...prev, acOnly: !prev.acOnly }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filters.acOnly
                ? 'border border-[#0070F3] bg-[#0070F3]/10 text-[#0070F3] font-semibold'
                : 'border border-[#111111]/10 bg-white text-[#71717A] hover:border-[#111111]/25'
            }`}
          >
            ❄️ AC
          </button>

          <button
            onClick={() =>
              onChange((prev: FilterState) => ({ ...prev, prayerRoomOnly: !prev.prayerRoomOnly }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filters.prayerRoomOnly
                ? 'border border-[#0070F3] bg-[#0070F3]/10 text-[#0070F3] font-semibold'
                : 'border border-[#111111]/10 bg-white text-[#71717A] hover:border-[#111111]/25'
            }`}
          >
            🕌 Mushola
          </button>

        </div>

      </div>
    </div>
  );
}
