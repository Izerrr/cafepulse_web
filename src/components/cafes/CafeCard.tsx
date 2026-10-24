'use client';

import React from 'react';
import { Cafe } from '@/types/cafe';
import {
  Wifi,
  Plug,
  Volume2,
  Clock,
  MapPin,
  ArrowRight,
  Edit2,
  Star,
} from 'lucide-react';

interface CafeCardProps {
  cafe: Cafe;
  onExplore: (cafe: Cafe) => void;
  onEdit: (cafe: Cafe) => void;
}

export default function CafeCard({ cafe, onExplore, onEdit }: CafeCardProps) {
  const { amenities } = cafe;
  const wifiSpeed = amenities?.wifi_speed_mbps || 0;
  const wifiStability = amenities?.wifi_stability || 'FAIR';
  const plugScore = amenities?.plug_score || 'LIMITED';
  const noiseLevel = amenities?.noise_level || 'MODERATE';

  // Crowd config
  const getCrowdLabel = (crowd: string) => {
    switch (crowd) {
      case 'LOW':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-400',
          text: 'Sepi · Cocok untuk fokus',
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          dot: 'bg-amber-400',
          text: 'Keramaian sedang',
        };
      case 'HIGH':
      default:
        return {
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          dot: 'bg-rose-400',
          text: 'Ramai · Area sosial',
        };
    }
  };

  const crowd = getCrowdLabel(cafe.crowd_density);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121215] p-5 transition-all duration-200 hover:border-white/20 hover:bg-[#151519]">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          
          {/* Status keramaian */}
          <div className={`flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${crowd.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${crowd.dot}`} />
            <span>{crowd.text}</span>
          </div>

          {/* Jam buka */}
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <Clock className="h-3.5 w-3.5" />
            <span>{cafe.opening_hours || '08:00 - 22:00'}</span>
          </div>

        </div>

        {/* Nama kafe & alamat */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-[#EDEDED] group-hover:text-white transition-colors">
              {cafe.name}
            </h2>
            <div className="flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-[#D4D4D8]">
              <Star className="h-3 w-3 fill-[#E59850] text-[#E59850]" />
              <span className="font-mono">5.0</span>
            </div>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A1A1AA]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
            <span className="truncate">{cafe.address}</span>
          </div>
        </div>

        {/* Spesifikasi teknis (Wi-Fi, Colokan, Kebisingan) */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/[0.06] py-3 text-xs">
          
          {/* Wi-Fi */}
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#71717A]">
              <Wifi className="h-3 w-3 text-blue-400" />
              <span>Wi-Fi</span>
            </div>
            <div className="mt-1 text-base font-bold text-[#EDEDED] font-mono">
              {wifiSpeed} <span className="text-[10px] font-normal text-[#71717A]">Mbps</span>
            </div>
            <div className="text-[10px] text-blue-400">
              {wifiStability === 'EXCELLENT' ? 'Sangat Stabil' : wifiStability === 'GOOD' ? 'Stabil' : 'Cukup'}
            </div>
          </div>

          {/* Colokan */}
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#71717A]">
              <Plug className="h-3 w-3 text-[#E59850]" />
              <span>Colokan</span>
            </div>
            <div className="mt-1 text-base font-bold text-[#EDEDED]">
              {plugScore === 'PLENTY' ? 'Banyak' : plugScore === 'MODERATE' ? 'Sedang' : 'Terbatas'}
            </div>
            <div className="text-[10px] text-[#71717A]">
              {plugScore === 'PLENTY' ? 'Hampir tiap meja' : 'Titik tertentu'}
            </div>
          </div>

          {/* Suasana */}
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#71717A]">
              <Volume2 className="h-3 w-3 text-emerald-400" />
              <span>Suasana</span>
            </div>
            <div className="mt-1 text-base font-bold text-[#EDEDED]">
              {noiseLevel === 'QUIET' ? 'Tenang' : noiseLevel === 'MODERATE' ? 'Sedang' : 'Ramai'}
            </div>
            <div className="text-[10px] text-[#71717A]">
              {noiseLevel === 'QUIET' ? 'Bagus buat meeting' : 'Musik kafe'}
            </div>
          </div>

        </div>

        {/* Fasilitas */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs text-[#A1A1AA]">
          {amenities?.air_conditioned && (
            <span className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px]">
              Ruang AC
            </span>
          )}
          {amenities?.has_outdoor && (
            <span className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px]">
              Area Terbuka
            </span>
          )}
          {amenities?.has_prayer_room && (
            <span className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px]">
              Mushola
            </span>
          )}
          <span className="text-[#71717A] text-[11px] ml-auto">
            {cafe.total_reviews} ulasan
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-3.5">
        
        <button
          onClick={() => onExplore(cafe)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/[0.06] py-2 text-xs font-medium text-[#EDEDED] transition-colors hover:bg-white/10 hover:text-white"
        >
          <span>Lihat Detail Kafe</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onEdit(cafe)}
          title="Edit data fasilitas"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#71717A] transition-colors hover:border-white/20 hover:text-white"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>

      </div>

    </div>
  );
}
