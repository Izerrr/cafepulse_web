'use client';

import React from 'react';
import { Target, Users, Coffee, Bookmark } from 'lucide-react';

export type MoodMode = 'ALL' | 'DEEP_WORK' | 'MEETING' | 'BOOKMARKS';

interface MoodSwitcherProps {
  currentMood: MoodMode;
  onSelectMood: (mood: MoodMode) => void;
  totalBookmarks: number;
}

export default function MoodSwitcher({
  currentMood,
  onSelectMood,
  totalBookmarks,
}: MoodSwitcherProps) {
  const moods = [
    {
      id: 'ALL' as MoodMode,
      icon: Coffee,
      label: 'Semua Kafe',
      desc: 'Tampilkan seluruh direktori',
    },
    {
      id: 'DEEP_WORK' as MoodMode,
      icon: Target,
      label: 'Deep Work / Skripsi',
      desc: 'Wi-Fi kencang & colokan banyak',
    },
    {
      id: 'MEETING' as MoodMode,
      icon: Users,
      label: 'Diskusi & Meeting',
      desc: 'Ruang ber-AC & area luas',
    },
    {
      id: 'BOOKMARKS' as MoodMode,
      icon: Bookmark,
      label: `Tersimpan (${totalBookmarks})`,
      desc: 'Daftar kafe favoritmu',
    },
  ];

  return (
    <div className="border-b border-canvas-border bg-canvas-bg py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-roast-400 uppercase tracking-wider mr-2 hidden sm:inline">
          Filter Cepat:
        </span>

        {moods.map((m) => {
          const Icon = m.icon;
          const isActive = currentMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-roast-900 text-white shadow-xs'
                  : 'border border-canvas-border bg-white text-roast-700 hover:border-canvas-border-hover hover:bg-canvas-surface hover:text-roast-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-crema-400' : 'text-roast-400'}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
