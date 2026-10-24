'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cafe, CrowdDensity, NoiseLevel, PlugScore, UpdateCafeInput, WifiStability } from '@/types/cafe';
import { X, Check, AlertCircle, Loader2, Save } from 'lucide-react';

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
        className="fixed inset-0 bg-[#0F0D0C]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col border border-[#E08E45] bg-[#161311] brutalist-shadow-amber shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2F2723] bg-[#0F0D0C] px-5 py-4">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="border border-[#E08E45] bg-[#1C1816] px-2 py-0.5 font-bold text-[#E08E45]">
              [UPDATE SPECS // #{cafe.id}]
            </span>
            <span className="text-[#9C9289] font-bold truncate max-w-[200px]">{cafe.name}</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-[#2F2723] bg-[#1C1816] text-[#9C9289] transition-colors hover:border-red-500 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="flex items-start gap-2.5 border border-red-800/80 bg-red-950/30 p-3 font-['JetBrains_Mono'] text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                  Crowd Density
                </label>
                <select
                  value={crowdDensity}
                  onChange={(e) => setCrowdDensity(e.target.value as CrowdDensity)}
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="LOW">LOW (Quiet / High Focus)</option>
                  <option value="MODERATE">MODERATE (Balanced)</option>
                  <option value="HIGH">HIGH (Busy)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="EXCELLENT">EXCELLENT</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="PLENTY">PLENTY</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="NONE">NONE</option>
                </select>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="QUIET">QUIET</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="NOISY">NOISY</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-['JetBrains_Mono'] text-xs pt-2">
              <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.air_conditioned}
                  onChange={(e) =>
                    setAmenities({ ...amenities, air_conditioned: e.target.checked })
                  }
                  className="accent-[#E08E45]"
                />
                <span>AC</span>
              </label>

              <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.has_outdoor}
                  onChange={(e) =>
                    setAmenities({ ...amenities, has_outdoor: e.target.checked })
                  }
                  className="accent-[#E08E45]"
                />
                <span>Outdoor</span>
              </label>

              <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.has_prayer_room}
                  onChange={(e) =>
                    setAmenities({ ...amenities, has_prayer_room: e.target.checked })
                  }
                  className="accent-[#E08E45]"
                />
                <span>Mushola</span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#2F2723] pt-5">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 border border-[#E08E45] bg-[#E08E45] py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#0F0D0C] transition-all hover:bg-[#F59E0B] brutalist-shadow-black disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>SAVING CHANGES...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>SAVE UPDATED SPECS</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
