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
        text: `Cek ${currentCafe.name} di cafepulse. - Wi-Fi ${amenities?.wifi_speed_mbps || 0} Mbps, colokan ${amenities?.plug_score}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berhasil disalin ke papan klip.');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCafe.latitude},${currentCafe.longitude}`;

  const getCrowdBadge = (density: string) => {
    switch (density) {
      case 'LOW':
        return { text: '🟢 Sepi (Kondusif)', badge: 'border-emerald-200 bg-emerald-50 text-emerald-800' };
      case 'MODERATE':
        return { text: '🟡 Keramaian Sedang', badge: 'border-amber-200 bg-amber-50 text-amber-800' };
      case 'HIGH':
        return { text: '🔴 Ramai', badge: 'border-rose-200 bg-rose-50 text-rose-800' };
      default:
        return { text: 'Normal', badge: 'border-gray-200 bg-gray-50 text-gray-700' };
    }
  };

  const crowd = getCrowdBadge(currentCafe.crowd_density);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#111111]/15 bg-white text-[#111111] shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-[#111111]/8 bg-[#FAFAFC] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#71717A]">
            <span className="font-mono font-semibold text-[#111111]">Kafe #{currentCafe.id}</span>
            <span>/ Lembar Verifikasi Spesifikasi</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(currentCafe);
              }}
              className="flex items-center gap-1.5 rounded-full border border-[#111111]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#F5F5F7]"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit Data</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[#111111]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] transition-colors hover:border-[#111111]/30 hover:bg-[#F5F5F7]"
            >
              <Share2 className="h-3 w-3" />
              <span>Bagikan</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#111111]/15 bg-white text-[#71717A] transition-colors hover:text-[#111111] hover:border-[#111111]/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-xl border border-[#111111]/10 bg-[#F9F9FB] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-[#888888] uppercase tracking-wider">
                  Katalog Kafe Surakarta
                </span>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#111111]">
                  {currentCafe.name}
                </h1>
              </div>

              <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${crowd.badge}`}>
                {crowd.text}
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-[#111111]/8 pt-3 text-xs text-[#555555] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#888888]" />
                <span>{currentCafe.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#888888]" />
                <span className="font-mono">Buka: {currentCafe.opening_hours || '08:00 - 22:00'}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#111111]/8 pt-3 text-xs">
              <span className="text-[#888888] font-mono">
                Koordinat: {currentCafe.latitude?.toFixed(4)}, {currentCafe.longitude?.toFixed(4)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-[#0070F3] hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider mb-3">
              Spesifikasi Fasilitas Kerja
            </h3>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              
              <div className="rounded-xl border border-[#111111]/8 bg-[#F9F9FB] p-4">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Kecepatan Unduh</span>
                  <Wifi className="h-3.5 w-3.5 text-[#0070F3]" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-[#111111]">
                  {amenities?.wifi_speed_mbps || 0}
                  <span className="ml-1 text-xs font-normal text-[#71717A]">Mbps</span>
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  Stabilitas:{' '}
                  <span className="text-[#0070F3] font-semibold">
                    {amenities?.wifi_stability === 'EXCELLENT'
                      ? 'Sangat Stabil'
                      : amenities?.wifi_stability === 'GOOD'
                      ? 'Stabil'
                      : 'Cukup'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#111111]/8 bg-[#F9F9FB] p-4">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Ketersediaan Daya</span>
                  <Plug className="h-3.5 w-3.5 text-[#E08E45]" />
                </div>
                <div className="mt-2 text-2xl font-bold text-[#111111]">
                  {amenities?.plug_score === 'PLENTY'
                    ? 'Banyak'
                    : amenities?.plug_score === 'MODERATE'
                    ? 'Sedang'
                    : 'Terbatas'}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  {amenities?.plug_score === 'PLENTY'
                    ? 'Colokan di tiap meja'
                    : 'Di dinding tertentu'}
                </div>
              </div>

              <div className="rounded-xl border border-[#111111]/8 bg-[#F9F9FB] p-4">
                <div className="flex items-center justify-between text-[#71717A] text-xs">
                  <span>Tingkat Kebisingan</span>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div className="mt-2 text-2xl font-bold text-emerald-700">
                  {amenities?.noise_level === 'QUIET'
                    ? 'Tenang'
                    : amenities?.noise_level === 'MODERATE'
                    ? 'Sedang'
                    : 'Ramai'}
                </div>
                <div className="mt-1 text-xs text-[#71717A]">
                  {amenities?.noise_level === 'QUIET'
                    ? 'Kondusif untuk fokus nugas'
                    : 'Suasana musik santai'}
                </div>
              </div>

            </div>
          </div>

          {/* Kelengkapan Ruangan */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider mb-3">
              Kelengkapan Ruangan
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.air_conditioned
                    ? 'border-[#111111]/15 bg-white text-[#111111] font-medium'
                    : 'border-[#111111]/5 bg-[#F9F9FB] text-[#888888]'
                }`}
              >
                <span>❄️</span>
                <span>Ruangan Ber-AC</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.has_outdoor
                    ? 'border-[#111111]/15 bg-white text-[#111111] font-medium'
                    : 'border-[#111111]/5 bg-[#F9F9FB] text-[#888888]'
                }`}
              >
                <span>🌿</span>
                <span>Area Terbuka / Merokok</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.has_prayer_room
                    ? 'border-[#111111]/15 bg-white text-[#111111] font-medium'
                    : 'border-[#111111]/5 bg-[#F9F9FB] text-[#888888]'
                }`}
              >
                <span>🕌</span>
                <span>Mushola Tersedia</span>
              </div>
            </div>
          </div>

          {/* Ulasan Pengunjung */}
          <div className="border-t border-[#111111]/8 pt-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-mono font-semibold text-[#888888] uppercase tracking-wider">
                Ulasan Lapangan ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#111111]">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="font-mono font-bold">5.0 / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-[#111111]/8 bg-[#F9F9FB] p-5 text-center text-xs text-[#71717A]">
                Belum ada ulasan untuk kafe ini.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-[#111111]/8 bg-[#F9F9FB] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/8 pb-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#111111]">Kontributor #{rev.user_id || rev.id}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                        {rev.verified_wifi_speed && (
                          <span className="rounded-full bg-[#0070F3]/10 px-2 py-0.5 text-[#0070F3] font-mono font-medium">
                            {rev.verified_wifi_speed} Mbps
                          </span>
                        )}
                        {rev.verified_crowd && (
                          <span>Keramaian: {rev.verified_crowd}</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#424242]">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-2 text-right text-[10px] font-mono text-[#888888]">
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
