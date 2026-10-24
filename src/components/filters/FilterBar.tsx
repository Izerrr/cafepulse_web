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
    <div className="border-b border-canvas-border bg-canvas-bg p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Search bar & results count */}
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
          
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-roast-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onChange((prev: FilterState) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Cari nama kafe atau area (misal: Slamet Riyadi, Jebres, UNS)..."
              className="w-full rounded-full border border-canvas-border bg-white py-2.5 pl-10 pr-9 text-xs text-roast-900 placeholder-roast-400 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
            />
            {filters.search && (
              <button
                onClick={() => onChange((prev: FilterState) => ({ ...prev, search: '' }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-roast-400 hover:text-roast-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-mono font-medium text-roast-400">
              Menampilkan {totalResults} lokasi terverifikasi
            </span>

            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-3.5 py-1.5 text-xs font-medium text-roast-700 transition-colors hover:border-canvas-border-hover hover:text-roast-900 shadow-xs"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

        </div>

        {/* Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3.5 border-t border-canvas-border text-xs">
          
          <span className="text-roast-400 text-[11px] font-mono mr-1">
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
                    ? 'bg-roast-900 text-white shadow-xs'
                    : 'border border-canvas-border bg-white text-roast-700 hover:border-canvas-border-hover'
                }`}
              >
                {density === 'LOW' && '🟢 Sepi (Fokus)'}
                {density === 'MODERATE' && '🟡 Sedang'}
                {density === 'ALL' && 'Semua'}
              </button>
            );
          })}

          <div className="h-4 w-px bg-canvas-border mx-1 hidden sm:block" />

          {/* Wi-Fi Speeds */}
          <span className="text-roast-400 text-[11px] font-mono mr-1">
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
                    ? 'bg-crema-500 text-white font-semibold shadow-xs'
                    : 'border border-canvas-border bg-white text-roast-700 hover:border-canvas-border-hover'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="h-4 w-px bg-canvas-border mx-1 hidden sm:block" />

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
                ? 'bg-crema-400 text-white shadow-xs'
                : 'border border-canvas-border bg-white text-roast-700 hover:border-canvas-border-hover'
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
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-canvas-border bg-white text-roast-700 hover:border-canvas-border-hover'
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
                ? 'border border-crema-500 bg-crema-50 text-crema-600 font-semibold'
                : 'border border-canvas-border bg-white text-roast-500 hover:border-canvas-border-hover'
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
                ? 'border border-crema-500 bg-crema-50 text-crema-600 font-semibold'
                : 'border border-canvas-border bg-white text-roast-500 hover:border-canvas-border-hover'
            }`}
          >
            🕌 Mushola
          </button>

        </div>

      </div>
    </div>
  );
}
