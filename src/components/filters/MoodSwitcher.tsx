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
    <div className="border-b border-white/[0.08] bg-[#0C0C0E] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-[#71717A] uppercase mr-2 hidden sm:inline">
          Filter Cepat:
        </span>

        {moods.map((m) => {
          const Icon = m.icon;
          const isActive = currentMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EDEDED] text-[#09090B] shadow-sm'
                  : 'border border-white/10 bg-white/[0.02] text-[#A1A1AA] hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#09090B]' : 'text-[#71717A]'}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

