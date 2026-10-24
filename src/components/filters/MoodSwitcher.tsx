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
    <div className="border-b border-[#111111]/8 bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-[#888888] uppercase mr-2 hidden sm:inline">
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
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'border border-[#111111]/10 bg-[#F5F5F7] text-[#424242] hover:border-[#111111]/25 hover:text-[#111111]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
