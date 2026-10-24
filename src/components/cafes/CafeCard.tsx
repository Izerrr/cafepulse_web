'use client';

import React from 'react';
import { Cafe } from '@/types/cafe';
import {
  Wifi,
  Plug,
  Volume2,
  Clock,
  MapPin,
  ArrowUpRight,
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

  // Crowd density indicator styling
  const getCrowdConfig = (crowd: string) => {
    switch (crowd) {
      case 'LOW':
        return {
          bg: 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'Low Crowd · Ideal for Focus',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/[0.08] border-amber-500/20 text-amber-400',
          dot: 'bg-amber-400',
          label: 'Moderate Crowd',
        };
      case 'HIGH':
      default:
        return {
          bg: 'bg-rose-500/[0.08] border-rose-500/20 text-rose-400',
          dot: 'bg-rose-400',
          label: 'High Density · Social',
        };
    }
  };

  const crowdConfig = getCrowdConfig(cafe.crowd_density);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#161311] to-[#100E0C] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-black/50">
      
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] pb-3.5">
          
          {/* Live Crowd Pulse Badge */}
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${crowdConfig.bg}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${crowdConfig.dot}`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${crowdConfig.dot}`}
              />
            </span>
            <span>{crowdConfig.label}</span>
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-1.5 text-xs text-[#A3988E]">
            <Clock className="h-3.5 w-3.5 text-[#E59850]" />
            <span>{cafe.opening_hours || '08:00 - 22:00'}</span>
          </div>

        </div>

        {/* Cafe Name & Location */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#F9F6F0] group-hover:text-[#E59850] transition-colors">
              {cafe.name}
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-2.5 py-0.5 text-xs font-semibold text-[#E59850]">
              <Star className="h-3 w-3 fill-[#E59850] text-[#E59850]" />
              <span>5.0</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A3988E]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C86237]" />
            <span className="truncate">{cafe.address}</span>
          </div>
        </div>

        {/* 3 Metric Gauge Boxes */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 border-y border-white/[0.06] py-3.5">
          
          {/* Wi-Fi Speed */}
          <div className="rounded-xl border border-white/[0.05] bg-[#0E0C0B]/60 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#A3988E]">
              <Wifi className="h-3 w-3 text-blue-400" />
              <span>Wi-Fi</span>
            </div>
            <div className="mt-1 text-xl font-bold tracking-tight text-[#F9F6F0]">
              {wifiSpeed}
              <span className="ml-0.5 text-[10px] font-normal text-blue-400">Mbps</span>
            </div>
            <div className="mt-0.5 text-[10px] font-medium text-blue-400">
              ⚡ {wifiStability}
            </div>
          </div>

          {/* Sockets */}
          <div className="rounded-xl border border-white/[0.05] bg-[#0E0C0B]/60 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#A3988E]">
              <Plug className="h-3 w-3 text-[#E59850]" />
              <span>Sockets</span>
            </div>
            <div className="mt-1 text-base font-bold text-[#E59850]">
              {plugScore}
            </div>
            <div className="mt-0.5 text-[10px] text-[#A3988E]">
              {plugScore === 'PLENTY' ? 'At each desk' : 'Select areas'}
            </div>
          </div>

          {/* Acoustics */}
          <div className="rounded-xl border border-white/[0.05] bg-[#0E0C0B]/60 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#A3988E]">
              <Volume2 className="h-3 w-3 text-emerald-400" />
              <span>Noise</span>
            </div>
            <div className="mt-1 text-base font-bold text-emerald-400">
              {noiseLevel}
            </div>
            <div className="mt-0.5 text-[10px] text-[#A3988E]">
              {noiseLevel === 'QUIET' ? 'Deep focus' : 'Cafe music'}
            </div>
          </div>

        </div>

        {/* Amenities Micro-Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          {amenities?.air_conditioned && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[#D5CCC2]">
              ❄️ AC
            </span>
          )}
          {amenities?.has_outdoor && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[#D5CCC2]">
              🌿 Outdoor
            </span>
          )}
          {amenities?.has_prayer_room && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[#D5CCC2]">
              🕌 Mushola
            </span>
          )}
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[#A3988E]">
            💬 {cafe.total_reviews} {cafe.total_reviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex items-center gap-2 border-t border-white/[0.06] pt-4">
        
        {/* Explore Button */}
        <button
          onClick={() => onExplore(cafe)}
          className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E59850] py-2.5 text-xs font-semibold text-[#0B0908] transition-all hover:bg-[#F0A560] active:scale-[0.98]"
        >
          <span>Explore Details</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(cafe)}
          title="Edit space specs"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-[#A3988E] transition-colors hover:border-amber-500/40 hover:text-[#E59850]"
        >
          <Edit2 className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}
