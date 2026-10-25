'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, CURATED_SOLO_PLACES } from '@/lib/api';
import {
  CreateCafeInput,
  CrowdDensity,
  MapsPlaceCandidate,
  NoiseLevel,
  PlugScore,
  WifiStability,
} from '@/types/cafe';
import { X, Plus, AlertCircle, Loader2, Search, MapPin, Sparkles, Check } from 'lucide-react';

interface AddCafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCafeModal({ isOpen, onClose }: AddCafeModalProps) {
  const queryClient = useQueryClient();

  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsResults, setMapsResults] = useState<MapsPlaceCandidate[]>(
    CURATED_SOLO_PLACES.slice(0, 4)
  );
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCafeInput>({
    name: '',
    address: '',
    opening_hours: '08:00 - 23:00',
    crowd_density: 'LOW',
    latitude: -7.565,
    longitude: 110.828,
    amenities: {
      wifi_speed_mbps: 85,
      wifi_stability: 'EXCELLENT',
      plug_score: 'PLENTY',
      noise_level: 'QUIET',
      air_conditioned: true,
      has_outdoor: true,
      has_prayer_room: true,
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setIsSearchingMaps(true);
      try {
        const res = await api.searchSoloPlacesFromMaps(mapsQuery);
        if (active) {
          setMapsResults(res.slice(0, 5));
        }
      } finally {
        if (active) setIsSearchingMaps(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [mapsQuery]);

  const handleSelectPlace = (place: MapsPlaceCandidate) => {
    setSelectedPlaceId(place.id);
    setFormData((prev) => ({
      ...prev,
      name: place.name,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      opening_hours: place.opening_hours || prev.opening_hours,
    }));
  };

  const mutation = useMutation({
    mutationFn: (newCafe: CreateCafeInput) => api.createCafe(newCafe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['system-status'] });
      setErrorMessage(null);
      onClose();
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : 'Gagal menambahkan data kafe. Silakan coba lagi.';
      setErrorMessage(msg);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Mohon lengkapi nama kafe dan alamat jalan.');
      return;
    }
    mutation.mutate(formData);
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
              Tambah & Sinkronkan Kafe Baru
            </span>
            <span className="text-xs font-mono text-roast-400">/ Surakarta</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-canvas-border text-roast-400 hover:text-roast-900 hover:border-canvas-border-hover transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {/* Maps Auto-Import Section */}
          <div className="rounded-2xl border border-rose-500/30 bg-canvas-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Impor Langsung dari Google Maps Solo
              </span>
              <span className="font-mono text-[10px] text-roast-500">Auto-Fill Koordinat</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-roast-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mapsQuery}
                onChange={(e) => setMapsQuery(e.target.value)}
                placeholder="Ketik nama kafe atau tempel tautan Google Maps (maps.app.goo.gl)..."
                className="w-full rounded-xl border border-canvas-border bg-white pl-9 pr-8 py-2 text-xs text-roast-900 placeholder-roast-400 outline-none focus:border-rose-500"
              />
              {isSearchingMaps && (
                <Loader2 className="w-3.5 h-3.5 text-rose-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {mapsResults.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {mapsResults.map((place) => {
                  const isSelected = selectedPlaceId === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 text-roast-900'
                          : 'bg-white border-canvas-border hover:border-rose-300 text-roast-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{place.name}</span>
                          {place.rating && (
                            <span className="text-[10px] font-mono text-amber-600 font-normal">
                              ★ {place.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-roast-500 truncate pl-4">{place.address}</p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-canvas-surface border border-canvas-border font-mono text-[10px] font-bold text-rose-600 flex items-center gap-1">
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" /> Terisi
                          </>
                        ) : (
                          'Pakai Data'
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-roast-850 mb-1.5">
              Nama Kafe *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Tanaku Kopi & Coworking"
              className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 placeholder-roast-400 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-roast-850 mb-1.5">
              Alamat Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Adi Sucipto No. 45, Manahan, Surakarta"
              className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 placeholder-roast-400 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-roast-500 mb-1">
                Latitude (Peta)
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3 py-2 text-xs font-mono text-roast-800 outline-none focus:border-crema-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-roast-500 mb-1">
                Longitude (Peta)
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3 py-2 text-xs font-mono text-roast-800 outline-none focus:border-crema-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Jam Operasional
              </label>
              <input
                type="text"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                placeholder="08:00 - 23:00"
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Rata-rata Keramaian
              </label>
              <select
                value={formData.crowd_density}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    crowd_density: e.target.value as CrowdDensity,
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="LOW">Sepi (Kondusif untuk fokus)</option>
                <option value="MODERATE">Sedang (Santai)</option>
                <option value="HIGH">Ramai (Sosial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-canvas-border pt-3">
            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Kecepatan Wi-Fi (Mbps)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.amenities.wifi_speed_mbps}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: {
                      ...formData.amenities,
                      wifi_speed_mbps: Number(e.target.value),
                    },
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
                value={formData.amenities.wifi_stability}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: {
                      ...formData.amenities,
                      wifi_stability: e.target.value as WifiStability,
                    },
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="EXCELLENT">Sangat Stabil (Lancar rapat video)</option>
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
                value={formData.amenities.plug_score}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: {
                      ...formData.amenities,
                      plug_score: e.target.value as PlugScore,
                    },
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="PLENTY">Banyak (Tersedia di tiap meja)</option>
                <option value="MODERATE">Sedang (Di area tertentu)</option>
                <option value="LIMITED">Terbatas</option>
                <option value="NONE">Tidak Ada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-roast-850 mb-1.5">
                Kebisingan Suasana
              </label>
              <select
                value={formData.amenities.noise_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: {
                      ...formData.amenities,
                      noise_level: e.target.value as NoiseLevel,
                    },
                  })
                }
                className="w-full rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-2.5 text-xs text-roast-900 outline-none transition-all focus:border-crema-500 focus:ring-2 focus:ring-crema-500/15"
              >
                <option value="QUIET">Tenang (Fokus kerja &amp; skripsi)</option>
                <option value="MODERATE">Sedang (Musik santai)</option>
                <option value="NOISY">Ramai</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-roast-850 mb-2">
              Kelengkapan Fasilitas
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
              <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
                <input
                  type="checkbox"
                  checked={formData.amenities.air_conditioned}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: {
                        ...formData.amenities,
                        air_conditioned: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-crema-500 focus:ring-crema-500"
                />
                <span className="font-medium text-roast-900">Ruang AC</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
                <input
                  type="checkbox"
                  checked={formData.amenities.has_outdoor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: {
                        ...formData.amenities,
                        has_outdoor: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-crema-500 focus:ring-crema-500"
                />
                <span className="font-medium text-roast-900">Area Terbuka</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-surface p-3 cursor-pointer hover:bg-canvas-surface-warm transition-colors">
                <input
                  type="checkbox"
                  checked={formData.amenities.has_prayer_room}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: {
                        ...formData.amenities,
                        has_prayer_room: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-crema-500 focus:ring-crema-500"
                />
                <span className="font-medium text-roast-900">Mushola</span>
              </label>
            </div>
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
                  <span>Menyinkronkan ke API CafePulse...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Simpan &amp; Sinkronkan ke Direktori</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
