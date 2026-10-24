'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cafe } from '@/types/cafe';
import {
  X,
  MapPin,
  Clock,
  Wifi,
  Plug,
  Volume2,
  Navigation,
  Share2,
  Edit2,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CafeDetailModalProps {
  cafe: Cafe | null;
  onClose: () => void;
  onEdit: (cafe: Cafe) => void;
}

export default function CafeDetailModal({
  cafe,
  onClose,
  onEdit,
}: CafeDetailModalProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (cafe) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [cafe, onClose]);

  // Fetch full details including reviews
  const { data: detailData, isLoading } = useQuery({
    queryKey: ['cafe-detail', cafe?.id],
    queryFn: () => (cafe ? api.getCafeById(cafe.id) : null),
    enabled: !!cafe,
  });

  if (!cafe) return null;

  const currentCafe = detailData?.data || cafe;
  const amenities = currentCafe.amenities;
  const reviews = currentCafe.reviews || [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentCafe.name,
        text: `Work at ${currentCafe.name} - Verified ${amenities?.wifi_speed_mbps || 0} Mbps Wi-Fi and ${amenities?.plug_score} sockets.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCafe.latitude},${currentCafe.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F0D0C]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col border border-[#E08E45] bg-[#161311] brutalist-shadow-amber shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-[#2F2723] bg-[#0F0D0C] px-5 py-3.5">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#9C9289]">
            <span className="border border-[#2F2723] bg-[#1C1816] px-2 py-0.5 font-bold text-[#E08E45]">
              [NODE #{currentCafe.id}]
            </span>
            <span className="hidden sm:inline">WORKSPACE VERIFICATION SHEET</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(currentCafe);
              }}
              className="flex items-center gap-1.5 border border-[#2F2723] bg-[#1C1816] px-2.5 py-1 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] transition-colors hover:border-[#E08E45] hover:text-[#E08E45]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>EDIT</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 border border-[#2F2723] bg-[#1C1816] px-2.5 py-1 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] transition-colors hover:border-[#E08E45] hover:text-[#E08E45]"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">SHARE</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center border border-[#2F2723] bg-[#1C1816] text-[#9C9289] transition-colors hover:border-red-500 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Header Banner */}
          <div className="relative border border-[#2F2723] bg-[#1C1816] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wider text-[#E08E45]">
                  SURAKARTA WORKSPACE INDEX
                </span>
                <h1 className="mt-1 font-['Syne'] text-3xl font-extrabold uppercase tracking-tight text-[#F7F3EE] sm:text-4xl">
                  {currentCafe.name}
                </h1>
              </div>

              {/* Crowd Density Badge */}
              <div className="border border-[#2F2723] bg-[#0F0D0C] px-3 py-1.5 font-['JetBrains_Mono'] text-xs">
                <span className="text-[#9C9289] uppercase">CURRENT CROWD: </span>
                <span className="font-bold text-[#10B981]">
                  {currentCafe.crowd_density === 'LOW' && '🟢 LOW DENSITY'}
                  {currentCafe.crowd_density === 'MODERATE' && '🟡 MODERATE DENSITY'}
                  {currentCafe.crowd_density === 'HIGH' && '🔴 HIGH DENSITY'}
                </span>
              </div>
            </div>

            {/* Address & Hours */}
            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[#2F2723] pt-4 font-['JetBrains_Mono'] text-xs text-[#D8D0C7] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#C86237]" />
                <span>{currentCafe.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Clock className="h-4 w-4 shrink-0 text-[#E08E45]" />
                <span>HOURS: {currentCafe.opening_hours || '08:00 - 22:00'}</span>
              </div>
            </div>

            {/* Maps Launch Button */}
            <div className="mt-4 flex items-center justify-between border-t border-[#2F2723] pt-3">
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#9C9289]">
                GEO: {currentCafe.latitude?.toFixed(4)}, {currentCafe.longitude?.toFixed(4)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs font-bold text-[#E08E45] hover:underline"
              >
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Deep Spec Telemetry Grid */}
          <div>
            <h3 className="font-['Syne'] text-lg font-bold uppercase tracking-wider text-[#F7F3EE] mb-3">
              HARDWARE &amp; AMBIENT METRICS
            </h3>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              
              {/* Wi-Fi Speed Card */}
              <div className="border border-[#2F2723] bg-[#141110] p-4">
                <div className="flex items-center justify-between text-[#9C9289]">
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase">WI-FI THROUGHPUT</span>
                  <Wifi className="h-4 w-4 text-blue-400" />
                </div>
                <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#F7F3EE]">
                  {amenities?.wifi_speed_mbps || 0}
                  <span className="ml-1 font-['JetBrains_Mono'] text-xs font-normal text-blue-400">
                    MBPS
                  </span>
                </div>
                <div className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9C9289]">
                  Stability: <span className="font-bold text-blue-400">{amenities?.wifi_stability || 'FAIR'}</span>
                </div>
              </div>

              {/* Power Socket Card */}
              <div className="border border-[#2F2723] bg-[#141110] p-4">
                <div className="flex items-center justify-between text-[#9C9289]">
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase">POWER OUTLETS</span>
                  <Plug className="h-4 w-4 text-[#E08E45]" />
                </div>
                <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-[#E08E45]">
                  {amenities?.plug_score || 'MODERATE'}
                </div>
                <div className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9C9289]">
                  {amenities?.plug_score === 'PLENTY' ? 'Outlets at every seat' : 'Available at select tables'}
                </div>
              </div>

              {/* Noise Level Card */}
              <div className="border border-[#2F2723] bg-[#141110] p-4">
                <div className="flex items-center justify-between text-[#9C9289]">
                  <span className="font-['JetBrains_Mono'] text-[11px] uppercase">AMBIENT SOUND</span>
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 font-['Syne'] text-3xl font-extrabold text-emerald-400">
                  {amenities?.noise_level || 'QUIET'}
                </div>
                <div className="mt-1 font-['JetBrains_Mono'] text-[11px] text-[#9C9289]">
                  {amenities?.noise_level === 'QUIET' ? 'Ideal for video calls & deep focus' : 'Lively cafe atmosphere'}
                </div>
              </div>

            </div>
          </div>

          {/* Facility Checklist */}
          <div>
            <h3 className="font-['Syne'] text-lg font-bold uppercase tracking-wider text-[#F7F3EE] mb-3">
              FACILITY CHECKLIST
            </h3>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-['JetBrains_Mono'] text-xs">
              <div
                className={`flex items-center gap-2.5 border p-3 ${
                  amenities?.air_conditioned
                    ? 'border-[#2F2723] bg-[#161311] text-[#F7F3EE]'
                    : 'border-[#2F2723]/40 bg-[#0F0D0C] text-[#574B43]'
                }`}
              >
                <span className="text-base">❄️</span>
                <span>Air Conditioned Area</span>
              </div>

              <div
                className={`flex items-center gap-2.5 border p-3 ${
                  amenities?.has_outdoor
                    ? 'border-[#2F2723] bg-[#161311] text-[#F7F3EE]'
                    : 'border-[#2F2723]/40 bg-[#0F0D0C] text-[#574B43]'
                }`}
              >
                <span className="text-base">🌿</span>
                <span>Outdoor / Smoking Space</span>
              </div>

              <div
                className={`flex items-center gap-2.5 border p-3 ${
                  amenities?.has_prayer_room
                    ? 'border-[#2F2723] bg-[#161311] text-[#F7F3EE]'
                    : 'border-[#2F2723]/40 bg-[#0F0D0C] text-[#574B43]'
                }`}
              >
                <span className="text-base">🕌</span>
                <span>Mushola / Prayer Room</span>
              </div>
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="border-t border-[#2F2723] pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Syne'] text-lg font-bold uppercase tracking-wider text-[#F7F3EE]">
                COMMUNITY REVIEWS &amp; VERIFICATION ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 font-['JetBrains_Mono'] text-xs text-[#E08E45]">
                <Star className="h-4 w-4 fill-[#E08E45]" />
                <span className="font-bold">5.0 / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="border border-[#2F2723] bg-[#141110] p-6 text-center font-['JetBrains_Mono'] text-xs text-[#9C9289]">
                <p>No community reviews recorded yet.</p>
                <p className="mt-1 text-[#574B43]">Be the first remote worker to submit a verification review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border border-[#2F2723] bg-[#141110] p-4 transition-colors hover:border-[#E08E45]/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2F2723]/60 pb-2.5 font-['JetBrains_Mono'] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F7F3EE]">CONTRIBUTOR #{rev.user_id || rev.id}</span>
                        <div className="flex text-[#E08E45]">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#E08E45]" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#9C9289]">
                        {rev.verified_wifi_speed && (
                          <span className="border border-blue-900/40 bg-blue-950/20 px-1.5 py-0.5 text-blue-400">
                            ⚡ {rev.verified_wifi_speed} MBPS
                          </span>
                        )}
                        {rev.verified_crowd && (
                          <span className="border border-emerald-900/40 bg-emerald-950/20 px-1.5 py-0.5 text-emerald-400">
                            CROWD: {rev.verified_crowd}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 font-['Inter'] text-sm leading-relaxed text-[#D8D0C7]">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-2 text-right font-['JetBrains_Mono'] text-[10px] text-[#574B43]">
                      AUDITED: {rev.created_at ? rev.created_at.slice(0, 10) : '2026-10-04'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
