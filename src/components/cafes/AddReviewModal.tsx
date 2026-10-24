'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Star, Wifi, Users, MessageSquareHeart, Loader2, CheckCircle2 } from 'lucide-react';
import { Cafe, CrowdDensity } from '@/types/cafe';
import { api } from '@/lib/api';

interface AddReviewModalProps {
  cafe: Cafe | null;
  onClose: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ cafe, onClose }) => {
  const queryClient = useQueryClient();

  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [testedWifiSpeed, setTestedWifiSpeed] = useState<string>(
    cafe?.amenities?.wifi_speed_mbps ? String(cafe.amenities.wifi_speed_mbps) : '50'
  );
  const [crowdStatus, setCrowdStatus] = useState<CrowdDensity>(
    cafe ? cafe.crowd_density : 'MODERATE'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!cafe) throw new Error('Kafe tidak ditemukan.');
      const parsedWifi = Number(testedWifiSpeed);
      return api.submitReview(cafe.id, {
        reviewer_name: userName.trim() || 'Pengunjung CafePulse',
        rating,
        comment: comment.trim(),
        verified_wifi_speed: !Number.isNaN(parsedWifi) && parsedWifi > 0 ? parsedWifi : undefined,
        verified_crowd: crowdStatus,
      });
    },
    onSuccess: () => {
      if (cafe) {
        queryClient.invalidateQueries({ queryKey: ['cafes'] });
        queryClient.invalidateQueries({ queryKey: ['cafe-detail', cafe.id] });
      }
      onClose();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Gagal mengirim ulasan. Silakan coba lagi.');
    },
  });

  if (!cafe) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!comment.trim()) {
      setErrorMsg('Tuliskan sedikit kesan atau pengalaman Anda singgah di kafe ini.');
      return;
    }
    mutation.mutate();
  };

  const activeStar = hoverRating ?? rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-roast-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-canvas-bg border border-canvas-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-canvas-border flex items-center justify-between bg-canvas-surface">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-crema-500 animate-pulse" />
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-crema-600 block">
                Ulasan &amp; Laporan Komunitas
              </span>
              <h3 className="text-sm font-bold text-roast-900 line-clamp-1">{cafe.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal ulasan"
            className="w-8 h-8 rounded-full border border-canvas-border flex items-center justify-center text-roast-500 hover:text-roast-900 hover:bg-canvas-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-status-red/10 border border-status-red/25 text-status-red text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Star Rating Picker */}
          <div className="p-4 rounded-2xl bg-canvas-surface border border-canvas-border text-center space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-500 block">
              Bagaimana Pengalaman Singgah Anda?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1.5 rounded-xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= activeStar
                        ? 'text-crema-500 fill-crema-500'
                        : 'text-canvas-border'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="font-mono text-xs font-bold text-roast-800">
              {activeStar === 5 && '5/5 • Sangat Nyaman & Direkomendasikan!'}
              {activeStar === 4 && '4/5 • Nyaman untuk Singgah / Nugas'}
              {activeStar === 3 && '3/5 • Cukup Oke'}
              {activeStar === 2 && '2/5 • Kurang Kondusif'}
              {activeStar === 1 && '1/5 • Perlu Banyak Perbaikan'}
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-roast-600 mb-1.5">
              Nama / Panggilan Anda
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Contoh: Bima — Mahasiswa UNS / Penikmat Kopi"
              className="w-full px-3.5 py-2.5 bg-canvas-surface border border-canvas-border rounded-xl text-sm text-roast-900 focus:outline-none focus:border-crema-500 transition-colors"
            />
          </div>

          {/* Live Telemetry Sync: Wi-Fi & Crowd */}
          <div className="p-4 rounded-2xl bg-canvas-surface border border-canvas-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-roast-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-status-green" /> Sinkronisasi Kondisi Real-Time ke API
              </span>
              <span className="font-mono text-[10px] text-roast-500">Opsional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-roast-500 mb-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-crema-500" /> Hasil Speedtest Wi-Fi (Mbps)
                </label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={testedWifiSpeed}
                  onChange={(e) => setTestedWifiSpeed(e.target.value)}
                  className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-xl text-xs font-mono font-bold text-roast-900 focus:outline-none focus:border-crema-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-roast-500 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-crema-500" /> Keramaian Saat Ini
                </label>
                <select
                  value={crowdStatus}
                  onChange={(e) => setCrowdStatus(e.target.value as CrowdDensity)}
                  className="w-full px-3 py-2 bg-canvas-bg border border-canvas-border rounded-xl text-xs font-bold text-roast-900 focus:outline-none focus:border-crema-500"
                >
                  <option value="LOW">Leluasa (Banyak Meja Kosong)</option>
                  <option value="MODERATE">Sedang (Cukup Kondusif)</option>
                  <option value="HIGH">Ramai (Hampir Penuh)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-roast-600 mb-1.5 flex items-center gap-1.5">
              <MessageSquareHeart className="w-3.5 h-3.5 text-crema-500" /> Ceritakan Pengalaman Anda *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagaimana rasa kopinya, keramahan barista, posisi colokan, atau kenyamanan suasananya?"
              className="w-full px-3.5 py-2.5 bg-canvas-surface border border-canvas-border rounded-xl text-sm text-roast-900 focus:outline-none focus:border-crema-500 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-canvas-border text-roast-600 hover:text-roast-900 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-roast-900 hover:bg-crema-500 disabled:opacity-50 text-canvas-bg font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              {mutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Kirim Ulasan &amp; Sinkronkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

