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
  Share2,
  Edit2,
  Star,
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

  const { data: detailData } = useQuery({
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
        className="fixed inset-0 bg-[#0B0908]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/[0.09] bg-[#14110F] shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0E0C0B] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#A3988E]">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#E59850]">
              Space #{currentCafe.id}
            </span>
            <span className="hidden sm:inline">Workspace Audit Sheet</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(currentCafe);
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-[#F9F6F0] transition-colors hover:border-amber-500/40 hover:text-[#E59850]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-[#F9F6F0] transition-colors hover:border-amber-500/40 hover:text-[#E59850]"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#A3988E] transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#E59850]">
                  Surakarta Workspace Directory
                </span>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#F9F6F0]">
                  {currentCafe.name}
                </h1>
              </div>

              {/* Crowd Density Badge */}
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400">
                {currentCafe.crowd_density === 'LOW' && '🟢 Low Density · Focus Ready'}
                {currentCafe.crowd_density === 'MODERATE' && '🟡 Moderate Density'}
                {currentCafe.crowd_density === 'HIGH' && '🔴 High Density'}
              </div>
            </div>

            {/* Address & Hours */}
            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-4 text-xs text-[#D5CCC2] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#C86237]" />
                <span>{currentCafe.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Clock className="h-4 w-4 shrink-0 text-[#E59850]" />
                <span>Hours: {currentCafe.opening_hours || '08:00 - 22:00'}</span>
              </div>
            </div>

            {/* Map Link */}
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span className="text-xs text-[#A3988E]">
                Coordinates: {currentCafe.latitude?.toFixed(4)}, {currentCafe.longitude?.toFixed(4)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#E59850] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Metric Telemetry Cards */}
          <div>
            <h3 className="text-sm font-semibold text-[#F9F6F0] mb-3">
              Hardware &amp; Ambient Telemetry
            </h3>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              
              {/* Wi-Fi */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-[#A3988E]">
                  <span className="text-xs">Wi-Fi Throughput</span>
                  <Wifi className="h-4 w-4 text-blue-400" />
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-[#F9F6F0]">
                  {amenities?.wifi_speed_mbps || 0}
                  <span className="ml-1 text-xs font-normal text-blue-400">Mbps</span>
                </div>
                <div className="mt-1 text-xs text-[#A3988E]">
                  Stability: <span className="font-semibold text-blue-400">{amenities?.wifi_stability || 'FAIR'}</span>
                </div>
              </div>

              {/* Sockets */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-[#A3988E]">
                  <span className="text-xs">Power Sockets</span>
                  <Plug className="h-4 w-4 text-[#E59850]" />
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-[#E59850]">
                  {amenities?.plug_score || 'MODERATE'}
                </div>
                <div className="mt-1 text-xs text-[#A3988E]">
                  {amenities?.plug_score === 'PLENTY' ? 'Sockets at every desk' : 'Select work tables'}
                </div>
              </div>

              {/* Noise */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-[#A3988E]">
                  <span className="text-xs">Acoustic Profile</span>
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
                  {amenities?.noise_level || 'QUIET'}
                </div>
                <div className="mt-1 text-xs text-[#A3988E]">
                  {amenities?.noise_level === 'QUIET' ? 'Ideal for video calls' : 'Ambient cafe chatter'}
                </div>
              </div>

            </div>
          </div>

          {/* Facilities Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-[#F9F6F0] mb-3">
              Facility Checklist
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
              <div
                className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                  amenities?.air_conditioned
                    ? 'border-white/[0.08] bg-white/[0.02] text-[#F9F6F0]'
                    : 'border-white/[0.04] bg-transparent text-[#6B6158]'
                }`}
              >
                <span>❄️</span>
                <span>Air Conditioned Area</span>
              </div>

              <div
                className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                  amenities?.has_outdoor
                    ? 'border-white/[0.08] bg-white/[0.02] text-[#F9F6F0]'
                    : 'border-white/[0.04] bg-transparent text-[#6B6158]'
                }`}
              >
                <span>🌿</span>
                <span>Outdoor Workspace</span>
              </div>

              <div
                className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                  amenities?.has_prayer_room
                    ? 'border-white/[0.08] bg-white/[0.02] text-[#F9F6F0]'
                    : 'border-white/[0.04] bg-transparent text-[#6B6158]'
                }`}
              >
                <span>🕌</span>
                <span>Mushola / Prayer Room</span>
              </div>
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="border-t border-white/[0.06] pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#F9F6F0]">
                Community Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#E59850]">
                <Star className="h-3.5 w-3.5 fill-[#E59850]" />
                <span className="font-semibold">5.0 / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 text-center text-xs text-[#A3988E]">
                <p>No community reviews recorded yet.</p>
                <p className="mt-1 text-[#6B6158]">Be the first remote worker to submit an audit review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-amber-500/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.05] pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#F9F6F0]">Contributor #{rev.user_id || rev.id}</span>
                        <div className="flex text-[#E59850]">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#E59850]" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#A3988E]">
                        {rev.verified_wifi_speed && (
                          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-400">
                            ⚡ {rev.verified_wifi_speed} Mbps
                          </span>
                        )}
                        {rev.verified_crowd && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                            Crowd: {rev.verified_crowd}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#D5CCC2]">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-2 text-right text-[11px] text-[#6B6158]">
                      Audited: {rev.created_at ? rev.created_at.slice(0, 10) : '2026-10-04'}
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
