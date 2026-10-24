'use client';

import React from 'react';
import { Wifi, Plug, Volume2, MapPin, Clock, Star, ArrowRight, Edit2, Bookmark } from 'lucide-react';
import { Cafe } from '@/types/cafe';

interface CafeCardProps {
  cafe: Cafe;
  onExplore: (cafe: Cafe) => void;
  onEdit: (cafe: Cafe) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (cafeId: number) => void;
}

export default function CafeCard({
  cafe,
  onExplore,
  onEdit,
  isBookmarked = false,
  onToggleBookmark,
}: CafeCardProps) {
  const { amenities } = cafe;

  const wifiSpeed = amenities?.wifi_speed_mbps || 0;
  const wifiStability = amenities?.wifi_stability || 'GOOD';
  const plugScore = amenities?.plug_score || 'MODERATE';
  const noiseLevel = amenities?.noise_level || 'MODERATE';

  const getCrowdLabel = (density: string) => {
    switch (density) {
      case 'LOW':
        return {
          text: 'Sepi (Fokus)',
          dot: 'bg-emerald-500',
          badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        };
      case 'MODERATE':
        return {
          text: 'Sedang (Santai)',
          dot: 'bg-amber-500',
          badge: 'border-amber-200 bg-amber-50 text-amber-800',
        };
      case 'HIGH':
        return {
          text: 'Ramai (Sosial)',
          dot: 'bg-rose-500',
          badge: 'border-rose-200 bg-rose-50 text-rose-800',
        };
      default:
        return {
          text: 'Normal',
          dot: 'bg-roast-300',
          badge: 'border-canvas-border bg-canvas-surface text-roast-700',
        };
    }
  };

  const crowd = getCrowdLabel(cafe.crowd_density);

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-canvas-border bg-white p-6 shadow-xs transition-all duration-300 hover:border-canvas-border-hover hover:shadow-xl hover:-translate-y-1">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-canvas-border pb-3.5">
          
          {/* Status keramaian */}
          <div className={`flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-semibold ${crowd.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${crowd.dot}`} />
            <span>{crowd.text}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Jam buka */}
            <div className="flex items-center gap-1.5 text-xs text-roast-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-roast-300" />
              <span>{cafe.opening_hours || '08:00 - 22:00'}</span>
            </div>

            {/* Bookmark button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(cafe.id)}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                  isBookmarked
                    ? 'border-crema-500 bg-crema-50 text-crema-500'
                    : 'border-canvas-border bg-white text-roast-300 hover:border-canvas-border-hover hover:text-roast-900'
                }`}
                title={isBookmarked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-crema-500' : ''}`} />
              </button>
            )}
          </div>

        </div>

        {/* Nama kafe & alamat */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight text-roast-900 group-hover:text-crema-500 transition-colors">
              {cafe.name}
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-canvas-border bg-canvas-surface px-2.5 py-0.5 text-xs text-roast-700">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="font-mono font-semibold">5.0</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-roast-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-roast-300" />
            <span className="truncate">{cafe.address}</span>
          </div>
        </div>

        {/* Spesifikasi teknis (Wi-Fi, Colokan, Kebisingan) */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 border-y border-canvas-border py-3.5 text-xs">
          
          {/* Wi-Fi */}
          <div className="rounded-xl border border-canvas-border bg-canvas-surface p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-roast-400">
              <Wifi className="h-3 w-3 text-accent-blue" />
              <span>Wi-Fi</span>
            </div>
            <div className="mt-1 text-base font-bold text-roast-900 font-mono">
              {wifiSpeed} <span className="text-[10px] font-normal text-roast-400">Mbps</span>
            </div>
            <div className="text-[10px] text-accent-blue font-medium">
              {wifiStability === 'EXCELLENT' ? 'Sangat Stabil' : wifiStability === 'GOOD' ? 'Stabil' : 'Cukup'}
            </div>
          </div>

          {/* Colokan */}
          <div className="rounded-xl border border-canvas-border bg-canvas-surface p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-roast-400">
              <Plug className="h-3 w-3 text-crema-500" />
              <span>Colokan</span>
            </div>
            <div className="mt-1 text-base font-bold text-roast-900">
              {plugScore === 'PLENTY' ? 'Banyak' : plugScore === 'MODERATE' ? 'Sedang' : 'Terbatas'}
            </div>
            <div className="text-[10px] text-roast-400">
              {plugScore === 'PLENTY' ? 'Di tiap meja' : 'Dinding tertentu'}
            </div>
          </div>

          {/* Suasana */}
          <div className="rounded-xl border border-canvas-border bg-canvas-surface p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-roast-400">
              <Volume2 className="h-3 w-3 text-accent-emerald" />
              <span>Suasana</span>
            </div>
            <div className="mt-1 text-base font-bold text-roast-900">
              {noiseLevel === 'QUIET' ? 'Tenang' : noiseLevel === 'MODERATE' ? 'Sedang' : 'Ramai'}
            </div>
            <div className="text-[10px] text-roast-400">
              {noiseLevel === 'QUIET' ? 'Fokus nugas' : 'Musik kafe'}
            </div>
          </div>

        </div>

        {/* Fasilitas */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-roast-600">
          {amenities?.air_conditioned && (
            <span className="rounded-full border border-canvas-border bg-canvas-surface px-2.5 py-0.5 text-[11px] font-medium text-roast-700">
              ❄️ Ruang AC
            </span>
          )}
          {amenities?.has_outdoor && (
            <span className="rounded-full border border-canvas-border bg-canvas-surface px-2.5 py-0.5 text-[11px] font-medium text-roast-700">
              🌿 Area Terbuka
            </span>
          )}
          {amenities?.has_prayer_room && (
            <span className="rounded-full border border-canvas-border bg-canvas-surface px-2.5 py-0.5 text-[11px] font-medium text-roast-700">
              🕌 Mushola
            </span>
          )}
          <span className="text-roast-400 text-[11px] font-mono ml-auto">
            {cafe.total_reviews} ulasan
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex items-center gap-2 border-t border-canvas-border pt-4">
        
        <button
          onClick={() => onExplore(cafe)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-roast-900 py-2.5 text-xs font-semibold text-white transition-all hover:bg-crema-500 active:scale-98 shadow-xs"
        >
          <span>Lihat Lembar Verifikasi</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onEdit(cafe)}
          title="Edit data fasilitas"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border text-roast-400 transition-colors hover:border-canvas-border-hover hover:text-roast-900"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

      </div>

    </article>
  );
}
