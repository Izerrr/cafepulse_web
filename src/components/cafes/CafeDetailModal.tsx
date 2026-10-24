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
        text: `Cek ${currentCafe.name} di CafePulse - Wi-Fi ${amenities?.wifi_speed_mbps || 0} Mbps, colokan ${amenities?.plug_score}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berhasil disalin ke clipboard.');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCafe.latitude},${currentCafe.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-white/10 bg-[#121215] shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0E0E11] px-5 py-3.5">
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <span className="font-mono text-[#D4D4D8]">Kafe #{currentCafe.id}</span>
            <span>/ Lembar Verifikasi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(currentCafe);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-[#EDEDED] transition-colors hover:border-white/20"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-[#EDEDED] transition-colors hover:border-white/20"
            >
              <Share2 className="h-3 w-3" />
              <span>Bagikan</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-[#71717A] transition-colors hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Header Card */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-[#71717A]">
                  Katalog Kafe Surakarta
                </span>
                <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDED]">
                  {currentCafe.name}
                </h1>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-[#D4D4D8]">
                {currentCafe.crowd_density === 'LOW' && '🟢 Sepi (Fokus)'}
                {currentCafe.crowd_density === 'MODERATE' && '🟡 Keramaian Sedang'}
                {currentCafe.crowd_density === 'HIGH' && '🔴 Ramai'}
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 text-xs text-[#A1A1AA] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                <span>{currentCafe.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                <span>Jam Buka: {currentCafe.opening_hours || '08:00 - 22:00'}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs">
              <span className="text-[#71717A] font-mono">
                GPS: {currentCafe.latitude?.toFixed(4)}, {currentCafe.longitude?.toFixed(4)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-medium text-[#EDEDED] hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div>
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-2.5">
              Spesifikasi Fasilitas Kerja
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Kecepatan Unduh</span>
                  <Wifi className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-[#EDEDED]">
                  {amenities?.wifi_speed_mbps || 0}
                  <span className="ml-1 text-xs font-normal text-[#71717A]">Mbps</span>
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  Stabilitas: <span className="text-blue-400 font-medium">{amenities?.wifi_stability || 'FAIR'}</span>
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Ketersediaan Daya</span>
                  <Plug className="h-3.5 w-3.5 text-[#E59850]" />
                </div>
                <div className="mt-2 text-xl font-bold text-[#EDEDED]">
                  {amenities?.plug_score === 'PLENTY' ? 'Banyak' : amenities?.plug_score === 'MODERATE' ? 'Sedang' : 'Terbatas'}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  {amenities?.plug_score === 'PLENTY' ? 'Colokan di tiap meja' : 'Di dinding tertentu'}
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Tingkat Kebisingan</span>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="mt-2 text-xl font-bold text-emerald-400">
                  {amenities?.noise_level === 'QUIET' ? 'Tenang' : amenities?.noise_level === 'MODERATE' ? 'Sedang' : 'Ramai'}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  {amenities?.noise_level === 'QUIET' ? 'Cocok untuk panggilan kerja' : 'Suasana santai'}
                </div>
              </div>

            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide mb-2.5">
              Kelengkapan Ruangan
            </h3>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
              <div
                className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                  amenities?.air_conditioned
                    ? 'border-white/10 bg-white/[0.02] text-[#EDEDED]'
                    : 'border-white/[0.04] text-[#52525B]'
                }`}
              >
                <span>❄️</span>
                <span>Ruangan Ber-AC</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                  amenities?.has_outdoor
                    ? 'border-white/10 bg-white/[0.02] text-[#EDEDED]'
                    : 'border-white/[0.04] text-[#52525B]'
                }`}
              >
                <span>🌿</span>
                <span>Area Terbuka / Merokok</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                  amenities?.has_prayer_room
                    ? 'border-white/10 bg-white/[0.02] text-[#EDEDED]'
                    : 'border-white/[0.04] text-[#52525B]'
                }`}
              >
                <span>🕌</span>
                <span>Mushola Tersedia</span>
              </div>
            </div>
          </div>

          {/* Ulasan Komunitas */}
          <div className="border-t border-white/[0.08] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide">
                Ulasan Pengunjung ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#D4D4D8]">
                <Star className="h-3 w-3 fill-[#E59850] text-[#E59850]" />
                <span className="font-mono">5.0 / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-5 text-center text-xs text-[#71717A]">
                Belum ada ulasan untuk kafe ini.
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.05] pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#EDEDED]">Kontributor #{rev.user_id || rev.id}</span>
                        <div className="flex text-[#E59850]">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-[#E59850]" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                        {rev.verified_wifi_speed && (
                          <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-400 font-mono">
                            {rev.verified_wifi_speed} Mbps
                          </span>
                        )}
                        {rev.verified_crowd && (
                          <span>Keramaian: {rev.verified_crowd}</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#D4D4D8]">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-1.5 text-right text-[10px] text-[#52525B]">
                      {rev.created_at ? rev.created_at.slice(0, 10) : '2026-10-04'}
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
