'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreateCafeInput, CrowdDensity, NoiseLevel, PlugScore, WifiStability } from '@/types/cafe';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';

interface AddCafeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCafeModal({ isOpen, onClose }: AddCafeModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateCafeInput>({
    name: '',
    address: '',
    opening_hours: '08:00 - 23:00',
    crowd_density: 'LOW',
    latitude: -7.5650,
    longitude: 110.8280,
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

  const mutation = useMutation({
    mutationFn: (newCafe: CreateCafeInput) => api.createCafe(newCafe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['system-status'] });
      setErrorMessage(null);
      onClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Gagal menambahkan data kafe. Silakan coba lagi.';
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
      <div
        className="fixed inset-0 bg-[#09090B]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl border border-white/10 bg-[#121215] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0E0E11] px-5 py-3.5">
          <span className="text-sm font-semibold text-[#EDEDED]">
            Tambah Kafe ke Direktori
          </span>

          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-[#71717A] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Nama Kafe *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Ruang Temu Coffee & Space"
              className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] placeholder-[#71717A] outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Alamat Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Slamet Riyadi No. 120, Surakarta"
              className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] placeholder-[#71717A] outline-none focus:border-white/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                placeholder="08:00 - 23:00"
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
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
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              >
                <option value="LOW">Sepi (Fokus)</option>
                <option value="MODERATE">Sedang (Santai)</option>
                <option value="HIGH">Ramai (Sosial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-white/[0.06] pt-3">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
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
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
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
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              >
                <option value="EXCELLENT">Sangat Stabil (&lt; 15ms latensi)</option>
                <option value="GOOD">Stabil (Lancar untuk panggilan video)</option>
                <option value="FAIR">Cukup</option>
                <option value="POOR">Kurang Stabil</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
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
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              >
                <option value="PLENTY">Banyak (Hampir di setiap meja)</option>
                <option value="MODERATE">Sedang (Tersedia di meja tertentu)</option>
                <option value="LIMITED">Terbatas (Sedikit)</option>
                <option value="NONE">Tidak Ada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
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
                className="w-full rounded-lg border border-white/10 bg-[#18181B] px-3 py-2 text-xs text-[#EDEDED] outline-none focus:border-white/20"
              >
                <option value="QUIET">Tenang (Bagus untuk fokus)</option>
                <option value="MODERATE">Sedang (Musik latar santai)</option>
                <option value="NOISY">Ramai (Percakapan padat)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
              Fasilitas Tersedia
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181B] p-2.5 cursor-pointer">
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
                  className="rounded"
                />
                <span>Ruang AC</span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181B] p-2.5 cursor-pointer">
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
                  className="rounded"
                />
                <span>Area Terbuka</span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#18181B] p-2.5 cursor-pointer">
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
                  className="rounded"
                />
                <span>Mushola</span>
              </label>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#EDEDED] py-2.5 text-xs font-medium text-[#09090B] transition-colors hover:bg-white disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan ke direktori...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Simpan Kafe Baru</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
