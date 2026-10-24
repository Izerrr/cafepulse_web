'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cafe, CrowdDensity, NoiseLevel, PlugScore, UpdateCafeInput, WifiStability } from '@/types/cafe';
import { X, AlertCircle, Loader2, Save } from 'lucide-react';

interface EditCafeModalProps {
  cafe: Cafe | null;
  onClose: () => void;
}

function EditCafeModalContent({ cafe, onClose }: { cafe: Cafe; onClose: () => void }) {
  const queryClient = useQueryClient();

  const [openingHours, setOpeningHours] = useState(cafe.opening_hours || '08:00 - 23:00');
  const [crowdDensity, setCrowdDensity] = useState<CrowdDensity>(cafe.crowd_density || 'LOW');
  const [amenities, setAmenities] = useState({
    wifi_speed_mbps: cafe.amenities?.wifi_speed_mbps || 50,
    wifi_stability: (cafe.amenities?.wifi_stability || 'GOOD') as WifiStability,
    plug_score: (cafe.amenities?.plug_score || 'MODERATE') as PlugScore,
    noise_level: (cafe.amenities?.noise_level || 'QUIET') as NoiseLevel,
    air_conditioned: !!cafe.amenities?.air_conditioned,
    has_outdoor: !!cafe.amenities?.has_outdoor,
    has_prayer_room: !!cafe.amenities?.has_prayer_room,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: UpdateCafeInput) => api.updateCafe(cafe.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['cafe-detail', cafe.id] });
      onClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui data kafe.';
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      opening_hours: openingHours,
      crowd_density: crowdDensity,
      amenities,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-roast-950/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-canvas-border bg-white text-roast-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-canvas-border bg-canvas-surface px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-roast-900">
              Edit Data Fasilitas &middot; {cafe.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-canvas-border text-roast-400 hover:text-roast-900 hover:border-canvas-border-hover transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Jam Operasional
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Keramaian Saat Ini
              </label>
              <select
                value={crowdDensity}
                onChange={(e) => setCrowdDensity(e.target.value as CrowdDensity)}
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="LOW">Sepi (Kondusif untuk fokus)</option>
                <option value="MODERATE">Sedang (Santai)</option>
                <option value="HIGH">Ramai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Kecepatan Wi-Fi (Mbps)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={amenities.wifi_speed_mbps}
                onChange={(e) =>
                  setAmenities({
                    ...amenities,
                    wifi_speed_mbps: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Stabilitas Koneksi
              </label>
              <select
                value={amenities.wifi_stability}
                onChange={(e) =>
                  setAmenities({
                    ...amenities,
                    wifi_stability: e.target.value as WifiStability,
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="EXCELLENT">Sangat Stabil</option>
                <option value="GOOD">Stabil</option>
                <option value="FAIR">Cukup</option>
                <option value="POOR">Kurang Stabil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Colokan Listrik
              </label>
              <select
                value={amenities.plug_score}
                onChange={(e) =>
                  setAmenities({
                    ...amenities,
                    plug_score: e.target.value as PlugScore,
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="PLENTY">Banyak (Tiap meja)</option>
                <option value="MODERATE">Sedang (Meja tertentu)</option>
                <option value="LIMITED">Terbatas</option>
                <option value="NONE">Tidak Ada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Kebisingan Suasana
              </label>
              <select
                value={amenities.noise_level}
                onChange={(e) =>
                  setAmenities({
                    ...amenities,
                    noise_level: e.target.value as NoiseLevel,
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="QUIET">Tenang</option>
                <option value="MODERATE">Sedang</option>
                <option value="NOISY">Ramai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs pt-1">
            <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
              <input
                type="checkbox"
                checked={amenities.air_conditioned}
                onChange={(e) =>
                  setAmenities({ ...amenities, air_conditioned: e.target.checked })
                }
                className="rounded text-crema-500 focus:ring-crema-500"
              />
              <span className="font-medium text-roast-900">Ruang AC</span>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
              <input
                type="checkbox"
                checked={amenities.has_outdoor}
                onChange={(e) =>
                  setAmenities({ ...amenities, has_outdoor: e.target.checked })
                }
                className="rounded text-crema-500 focus:ring-crema-500"
              />
              <span className="font-medium text-roast-900">Area Terbuka</span>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
              <input
                type="checkbox"
                checked={amenities.has_prayer_room}
                onChange={(e) =>
                  setAmenities({ ...amenities, has_prayer_room: e.target.checked })
                }
                className="rounded text-crema-500 focus:ring-crema-500"
              />
              <span className="font-medium text-roast-900">Mushola</span>
            </label>
          </div>

          <div className="border-t border-canvas-border pt-5">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-roast-900 py-3 text-xs font-semibold text-white transition-all hover:bg-crema-500 active:scale-98 shadow-md disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan perubahan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function EditCafeModal({ cafe, onClose }: EditCafeModalProps) {
  useEffect(() => {
    document.body.style.overflow = cafe ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cafe]);

  if (!cafe) return null;

  return <EditCafeModalContent key={cafe.id} cafe={cafe} onClose={onClose} />;
}
