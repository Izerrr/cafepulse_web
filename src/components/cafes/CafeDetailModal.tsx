'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  MessageSquarePlus,
  Trash2,
} from 'lucide-react';

interface CafeDetailModalProps {
  cafe: Cafe | null;
  onClose: () => void;
  onEdit: (cafe: Cafe) => void;
  onReview?: (cafe: Cafe) => void;
  isCurator?: boolean;
}

export default function CafeDetailModal({
  cafe,
  onClose,
  onEdit,
  onReview,
  isCurator = false,
}: CafeDetailModalProps) {
  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => api.deleteCafe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      onClose();
    },
  });

  if (!cafe) return null;

  const currentCafe = detailData?.data || cafe;
  const amenities = currentCafe.amenities;
  const reviews = currentCafe.reviews || [];
  const displayRating = (currentCafe.rating || 5.0).toFixed(1);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: currentCafe.name,
          text: `Cek ${currentCafe.name} di cafepulse. - Wi-Fi ${
            amenities?.wifi_speed_mbps || 0
          } Mbps, colokan ${amenities?.plug_score}.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berhasil disalin ke papan klip.');
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentCafe.latitude},${currentCafe.longitude}`;

  const getCrowdBadge = (density: string) => {
    switch (density) {
      case 'LOW':
        return {
          text: '🟢 Sepi (Kondusif)',
          badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        };
      case 'MODERATE':
        return {
          text: '🟡 Keramaian Sedang',
          badge: 'border-amber-200 bg-amber-50 text-amber-800',
        };
      case 'HIGH':
        return { text: '🔴 Ramai', badge: 'border-rose-200 bg-rose-50 text-rose-800' };
      default:
        return { text: 'Normal', badge: 'border-canvas-border bg-canvas-surface text-roast-700' };
    }
  };

  const crowd = getCrowdBadge(currentCafe.crowd_density);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-roast-950/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-canvas-border bg-white text-roast-900 shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-canvas-border bg-canvas-surface px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-roast-500">
            <span className="font-mono font-semibold text-roast-900">Kafe #{currentCafe.id}</span>
            <span>/ Suasana &amp; Fasilitas Lengkap</span>
          </div>

          <div className="flex items-center gap-2">
            {onReview && (
              <button
                onClick={() => {
                  onClose();
                  onReview(currentCafe);
                }}
                className="flex items-center gap-1.5 rounded-full bg-crema-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-crema-600"
              >
                <MessageSquarePlus className="h-3 w-3" />
                <span>Beri Rating</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onEdit(currentCafe);
              }}
              className="flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-3 py-1.5 text-xs font-semibold text-roast-900 transition-colors hover:border-canvas-border-hover hover:bg-canvas-bg"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit Data</span>
            </button>

            {isCurator && (
              <button
                onClick={() => {
                  if (confirm(`Hapus "${currentCafe.name}" dari direktori?`)) {
                    deleteMutation.mutate(currentCafe.id);
                  }
                }}
                title="Hapus kafe (Mode Kurator)"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-canvas-border bg-white px-3 py-1.5 text-xs font-semibold text-roast-900 transition-colors hover:border-canvas-border-hover hover:bg-canvas-bg"
            >
              <Share2 className="h-3 w-3" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup detail kafe"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-canvas-border bg-white text-roast-400 transition-colors hover:text-roast-900 hover:border-canvas-border-hover"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header Card */}
          <div className="rounded-xl border border-canvas-border bg-canvas-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-roast-400 uppercase tracking-wider">
                  Sudut Kafe Surakarta
                </span>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-roast-900">
                  {currentCafe.name}
                </h1>
              </div>

              <div
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${crowd.badge}`}
              >
                {crowd.text}
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-1 gap-2 border-t border-canvas-border pt-3 text-xs text-roast-600 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-roast-400" />
                <span>{currentCafe.address}</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Clock className="h-3.5 w-3.5 shrink-0 text-roast-400" />
                <span className="font-mono">
                  Buka: {currentCafe.opening_hours || '08:00 - 22:00'}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-canvas-border pt-3 text-xs">
              <span className="text-roast-400 font-mono">
                Koordinat: {currentCafe.latitude?.toFixed(4)}, {currentCafe.longitude?.toFixed(4)}
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-semibold text-crema-600 hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-roast-400 uppercase tracking-wider mb-3">
              Kenyamanan &amp; Fasilitas Tempat
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-canvas-border bg-canvas-surface p-4">
                <div className="flex items-center justify-between text-roast-500 text-xs">
                  <span>Kecepatan Unduh</span>
                  <Wifi className="h-3.5 w-3.5 text-accent-blue" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-roast-900">
                  {amenities?.wifi_speed_mbps || 0}
                  <span className="ml-1 text-xs font-normal text-roast-400">Mbps</span>
                </div>
                <div className="mt-1 text-xs text-roast-500">
                  Stabilitas:{' '}
                  <span className="text-accent-blue font-semibold">
                    {amenities?.wifi_stability === 'EXCELLENT'
                      ? 'Sangat Stabil'
                      : amenities?.wifi_stability === 'GOOD'
                      ? 'Stabil'
                      : 'Cukup'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-canvas-border bg-canvas-surface p-4">
                <div className="flex items-center justify-between text-roast-500 text-xs">
                  <span>Ketersediaan Daya</span>
                  <Plug className="h-3.5 w-3.5 text-crema-500" />
                </div>
                <div className="mt-2 text-2xl font-bold text-roast-900">
                  {amenities?.plug_score === 'PLENTY'
                    ? 'Banyak'
                    : amenities?.plug_score === 'MODERATE'
                    ? 'Sedang'
                    : 'Terbatas'}
                </div>
                <div className="mt-1 text-xs text-roast-500">
                  {amenities?.plug_score === 'PLENTY'
                    ? 'Colokan di tiap meja'
                    : 'Di dinding tertentu'}
                </div>
              </div>

              <div className="rounded-xl border border-canvas-border bg-canvas-surface p-4">
                <div className="flex items-center justify-between text-roast-500 text-xs">
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
                <div className="mt-1 text-xs text-roast-500">
                  {amenities?.noise_level === 'QUIET'
                    ? 'Kondusif untuk fokus nugas'
                    : 'Suasana musik santai'}
                </div>
              </div>
            </div>
          </div>

          {/* Kelengkapan Ruangan */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-roast-400 uppercase tracking-wider mb-3">
              Fasilitas Pendukung
            </h3>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.air_conditioned
                    ? 'border-canvas-border bg-white text-roast-900 font-medium'
                    : 'border-canvas-border/50 bg-canvas-surface text-roast-400'
                }`}
              >
                <span>❄️</span>
                <span>Ruangan Ber-AC</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.has_outdoor
                    ? 'border-canvas-border bg-white text-roast-900 font-medium'
                    : 'border-canvas-border/50 bg-canvas-surface text-roast-400'
                }`}
              >
                <span>🌿</span>
                <span>Area Terbuka / Merokok</span>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  amenities?.has_prayer_room
                    ? 'border-canvas-border bg-white text-roast-900 font-medium'
                    : 'border-canvas-border/50 bg-canvas-surface text-roast-400'
                }`}
              >
                <span>🕌</span>
                <span>Mushola Tersedia</span>
              </div>
            </div>
          </div>

          {/* Ulasan Pengunjung */}
          <div className="border-t border-canvas-border pt-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-mono font-semibold text-roast-400 uppercase tracking-wider">
                Ulasan &amp; Cerita Pengunjung ({reviews.length})
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-roast-900">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-mono font-bold">{displayRating} / 5.0</span>
                </div>
                {onReview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReview(currentCafe);
                    }}
                    className="rounded-full bg-roast-900 hover:bg-crema-500 text-white px-3 py-1 text-[11px] font-mono font-bold transition-colors"
                  >
                    + Tulis Ulasan
                  </button>
                )}
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-xl border border-canvas-border bg-canvas-surface p-5 text-center text-xs text-roast-400 space-y-2">
                <p>Belum ada ulasan tertulis untuk kafe ini.</p>
                {onReview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReview(currentCafe);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-crema-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-crema-600 transition-colors"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    <span>Jadi yang Pertama Mengulas!</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-canvas-border bg-canvas-surface p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-border pb-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-roast-900">
                          {rev.reviewer_name || `Kontributor #${rev.user_id || rev.id}`}
                        </span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-2.5 w-2.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-roast-500">
                        {rev.verified_wifi_speed && (
                          <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-accent-blue font-mono font-medium">
                            {rev.verified_wifi_speed} Mbps
                          </span>
                        )}
                        {rev.verified_crowd && <span>Keramaian: {rev.verified_crowd}</span>}
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-relaxed text-roast-700">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-2 text-right text-[10px] font-mono text-roast-400">
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
