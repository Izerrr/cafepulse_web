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

export default function EditCafeModal({ cafe, onClose }: EditCafeModalProps) {
  const queryClient = useQueryClient();

  const [openingHours, setOpeningHours] = useState('');
  const [crowdDensity, setCrowdDensity] = useState<CrowdDensity>('LOW');
  const [amenities, setAmenities] = useState({
    wifi_speed_mbps: 85,
    wifi_stability: 'EXCELLENT' as WifiStability,
    plug_score: 'PLENTY' as PlugScore,
    noise_level: 'QUIET' as NoiseLevel,
    air_conditioned: true,
    has_outdoor: true,
    has_prayer_room: true,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (cafe) {
      document.body.style.overflow = 'hidden';
      setOpeningHours(cafe.opening_hours || '08:00 - 23:00');
      setCrowdDensity(cafe.crowd_density || 'LOW');
      if (cafe.amenities) {
        setAmenities({
          wifi_speed_mbps: cafe.amenities.wifi_speed_mbps || 50,
          wifi_stability: cafe.amenities.wifi_stability || 'GOOD',
          plug_score: cafe.amenities.plug_score || 'MODERATE',
          noise_level: cafe.amenities.noise_level || 'QUIET',
          air_conditioned: !!cafe.amenities.air_conditioned,
          has_outdoor: !!cafe.amenities.has_outdoor,
          has_prayer_room: !!cafe.amenities.has_prayer_room,
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cafe]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateCafeInput) =>
      api.updateCafe(cafe!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['cafe-detail', cafe?.id] });
      onClose();
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to update specs. Please try again.');
    },
  });

  if (!cafe) return null;

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
        className="fixed inset-0 bg-[#0B0908]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-white/[0.09] bg-[#14110F] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0E0C0B] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F9F6F0]">
              Edit Specs &middot; {cafe.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#A3988E] transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Crowd Density
                </label>
                <select
                  value={crowdDensity}
                  onChange={(e) => setCrowdDensity(e.target.value as CrowdDensity)}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="LOW">Low (Quiet / Focus Ready)</option>
                  <option value="MODERATE">Moderate (Balanced)</option>
                  <option value="HIGH">High (Social)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Wi-Fi Speed (Mbps)
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
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Wi-Fi Stability
                </label>
                <select
                  value={amenities.wifi_stability}
                  onChange={(e) =>
                    setAmenities({
                      ...amenities,
                      wifi_stability: e.target.value as WifiStability,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Plug Score
                </label>
                <select
                  value={amenities.plug_score}
                  onChange={(e) =>
                    setAmenities({
                      ...amenities,
                      plug_score: e.target.value as PlugScore,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="PLENTY">Plenty</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LIMITED">Limited</option>
                  <option value="NONE">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Noise Level
                </label>
                <select
                  value={amenities.noise_level}
                  onChange={(e) =>
                    setAmenities({
                      ...amenities,
                      noise_level: e.target.value as NoiseLevel,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="QUIET">Quiet</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="NOISY">Noisy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs pt-2">
              <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.air_conditioned}
                  onChange={(e) =>
                    setAmenities({ ...amenities, air_conditioned: e.target.checked })
                  }
                  className="accent-[#E59850] rounded"
                />
                <span>AC</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.has_outdoor}
                  onChange={(e) =>
                    setAmenities({ ...amenities, has_outdoor: e.target.checked })
                  }
                  className="accent-[#E59850] rounded"
                />
                <span>Outdoor</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.has_prayer_room}
                  onChange={(e) =>
                    setAmenities({ ...amenities, has_prayer_room: e.target.checked })
                  }
                  className="accent-[#E59850] rounded"
                />
                <span>Mushola</span>
              </label>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E59850] py-3 text-xs font-semibold text-[#0B0908] transition-all hover:bg-[#F0A560] active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Updated Specs</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
