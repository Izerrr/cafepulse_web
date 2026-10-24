'use client';

import React from 'react';
import { Cafe } from '@/types/cafe';
import {
  Wifi,
  Zap,
  Plug,
  Volume2,
  Clock,
  MapPin,
  ArrowUpRight,
  Edit2,
  Star,
  CheckCircle2,
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
          bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'LOW CROWD (DEEP WORK)',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-950/40 border-amber-800/60 text-amber-400',
          dot: 'bg-amber-400',
          label: 'MODERATE CROWD',
        };
      case 'HIGH':
      default:
        return {
          bg: 'bg-red-950/40 border-red-800/60 text-red-400',
          dot: 'bg-red-400',
          label: 'HIGH CROWD (BUSY)',
        };
    }
  };

  const crowdConfig = getCrowdConfig(cafe.crowd_density);

  return (
    <div className="group relative flex flex-col justify-between border border-[#2F2723] bg-[#161311] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#E08E45] hover:shadow-[4px_4px_0px_#E08E45]">
      
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-[#2F2723]/60 pb-3">
          
          {/* Live Crowd Pulse Dot & Badge */}
          <div
            className={`flex items-center gap-2 border px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider ${crowdConfig.bg}`}
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
          <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs text-[#9C9289]">
            <Clock className="h-3.5 w-3.5 text-[#E08E45]" />
            <span>{cafe.opening_hours || '08:00 - 22:00'}</span>
          </div>

        </div>

        {/* Cafe Name & Address */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-['Syne'] text-2xl font-bold uppercase tracking-tight text-[#F7F3EE] group-hover:text-[#E08E45] transition-colors">
              {cafe.name}
            </h2>
            <div className="flex items-center gap-1 border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 font-['JetBrains_Mono'] text-[11px] text-[#E08E45]">
              <Star className="h-3 w-3 fill-[#E08E45] text-[#E08E45]" />
              <span>5.0</span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs text-[#9C9289]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C86237]" />
            <span className="truncate">{cafe.address}</span>
          </div>
        </div>

        {/* Spec Metrics Matrix (Wi-Fi, Plugs, Noise) */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#2F2723]/80 py-3.5">
          
          {/* Metric 1: Wi-Fi Speed */}
          <div className="border border-[#2F2723] bg-[#0F0D0C] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              <Wifi className="h-3 w-3 text-blue-400" />
              <span>WI-FI SPEED</span>
            </div>
            <div className="mt-1 font-['Syne'] text-2xl font-extrabold text-[#F7F3EE]">
              {wifiSpeed}
              <span className="ml-0.5 font-['JetBrains_Mono'] text-[10px] font-normal text-blue-400">
                MBPS
              </span>
            </div>
            <div className="mt-0.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-blue-400">
              ⚡ {wifiStability}
            </div>
          </div>

          {/* Metric 2: Sockets */}
          <div className="border border-[#2F2723] bg-[#0F0D0C] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              <Plug className="h-3 w-3 text-[#E08E45]" />
              <span>SOCKETS</span>
            </div>
            <div className="mt-1 font-['Syne'] text-xl font-bold uppercase text-[#E08E45]">
              {plugScore}
            </div>
            <div className="mt-0.5 font-['JetBrains_Mono'] text-[9px] uppercase text-[#9C9289]">
              {plugScore === 'PLENTY' ? 'EVERY DESK' : 'LIMITED'}
            </div>
          </div>

          {/* Metric 3: Noise Level */}
          <div className="border border-[#2F2723] bg-[#0F0D0C] p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 font-['JetBrains_Mono'] text-[10px] text-[#9C9289] uppercase">
              <Volume2 className="h-3 w-3 text-emerald-400" />
              <span>ACOUSTICS</span>
            </div>
            <div className="mt-1 font-['Syne'] text-xl font-bold uppercase text-emerald-400">
              {noiseLevel}
            </div>
            <div className="mt-0.5 font-['JetBrains_Mono'] text-[9px] uppercase text-[#9C9289]">
              {noiseLevel === 'QUIET' ? 'FOCUS ZONE' : 'AMBIENT CHAT'}
            </div>
          </div>

        </div>

        {/* Amenities Micro-Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 font-['JetBrains_Mono'] text-[11px]">
          {amenities?.air_conditioned && (
            <span className="border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 text-[#D8D0C7]">
              ❄️ AIR CONDITIONED
            </span>
          )}
          {amenities?.has_outdoor && (
            <span className="border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 text-[#D8D0C7]">
              🌿 OUTDOOR AREA
            </span>
          )}
          {amenities?.has_prayer_room && (
            <span className="border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 text-[#D8D0C7]">
              🕌 PRAYER ROOM
            </span>
          )}
          <span className="border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 text-[#9C9289]">
            💬 {cafe.total_reviews} {cafe.total_reviews === 1 ? 'REVIEW' : 'REVIEWS'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 flex items-center gap-2 border-t border-[#2F2723]/60 pt-4">
        
        {/* Explore Button */}
        <button
          onClick={() => onExplore(cafe)}
          className="group/btn flex flex-1 items-center justify-center gap-2 border border-[#E08E45] bg-[#E08E45] py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#0F0D0C] transition-all hover:bg-[#F59E0B] active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>EXPLORE SPACE &amp; REVIEWS</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>

        {/* Quick Edit Specs */}
        <button
          onClick={() => onEdit(cafe)}
          title="Edit space amenities"
          className="flex h-10 w-10 items-center justify-center border border-[#2F2723] bg-[#1C1816] text-[#9C9289] transition-colors hover:border-[#E08E45] hover:text-[#E08E45]"
        >
          <Edit2 className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}

