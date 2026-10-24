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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: (newCafe: CreateCafeInput) => api.createCafe(newCafe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes'] });
      queryClient.invalidateQueries({ queryKey: ['system-status'] });
      onClose();
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || 'Failed to submit cafe space. Please try again.');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setErrorMessage('Please provide both cafe name and address.');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0908]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-white/[0.09] bg-[#14110F] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0E0C0B] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F9F6F0]">
              Submit Work-Friendly Cafe
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#A3988E] transition-colors hover:border-red-500/40 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wide text-[#E59850] uppercase">
              1. Space Information
            </h4>

            <div>
              <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                Cafe Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ruang Temu Coffee & Space"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] placeholder-[#6B6158] outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                Full Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Jl. Slamet Riyadi No. 120, Surakarta"
                className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] placeholder-[#6B6158] outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="08:00 - 23:00"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] placeholder-[#6B6158] outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Crowd Density
                </label>
                <select
                  value={formData.crowd_density}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      crowd_density: e.target.value as CrowdDensity,
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="LOW">Low (Quiet / Focus Ready)</option>
                  <option value="MODERATE">Moderate (Balanced)</option>
                  <option value="HIGH">High (Social / Busy)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Hardware Telemetry */}
          <div className="space-y-4 border-t border-white/[0.06] pt-5">
            <h4 className="text-xs font-semibold tracking-wide text-[#E59850] uppercase">
              2. Hardware &amp; Facilities
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Wi-Fi Speed (Mbps)
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
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Wi-Fi Stability
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
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="EXCELLENT">Excellent (&lt; 15ms latency)</option>
                  <option value="GOOD">Good (Stable calls &amp; video)</option>
                  <option value="FAIR">Fair (Occasional jitter)</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Plug Score (Outlets)
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
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="PLENTY">Plenty (At almost every desk)</option>
                  <option value="MODERATE">Moderate (Available at select desks)</option>
                  <option value="LIMITED">Limited (Few wall plugs)</option>
                  <option value="NONE">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3988E] mb-1.5">
                  Acoustic Noise Profile
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
                  className="w-full rounded-xl border border-white/[0.08] bg-[#0E0C0B] px-3.5 py-2.5 text-xs text-[#F9F6F0] outline-none transition-all focus:border-amber-500/50"
                >
                  <option value="QUIET">Quiet (Deep Focus Zone)</option>
                  <option value="MODERATE">Moderate (Light Cafe Music)</option>
                  <option value="NOISY">Noisy (High Chatter)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Amenities */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-[#A3988E] mb-2">
                Available Amenities
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                
                <label className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer hover:border-amber-500/40 transition-colors">
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
                    className="accent-[#E59850] rounded"
                  />
                  <span>Air Conditioned</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer hover:border-amber-500/40 transition-colors">
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
                    className="accent-[#E59850] rounded"
                  />
                  <span>Outdoor Area</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0E0C0B] p-3 cursor-pointer hover:border-amber-500/40 transition-colors">
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
                    className="accent-[#E59850] rounded"
                  />
                  <span>Prayer Room</span>
                </label>

              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="border-t border-white/[0.06] pt-5">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E59850] py-3 text-xs font-semibold text-[#0B0908] transition-all hover:bg-[#F0A560] active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting to Directory...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Publish Workspace to Directory</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
