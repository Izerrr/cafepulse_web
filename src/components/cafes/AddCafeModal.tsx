'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreateCafeInput, CrowdDensity, NoiseLevel, PlugScore, WifiStability } from '@/types/cafe';
import { X, Plus, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

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
        className="fixed inset-0 bg-[#0F0D0C]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col border border-[#E08E45] bg-[#161311] brutalist-shadow-amber shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2F2723] bg-[#0F0D0C] px-5 py-4">
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="border border-[#E08E45] bg-[#1C1816] px-2 py-0.5 font-bold text-[#E08E45]">
              [INDEX NEW WORKSPACE]
            </span>
            <span className="text-[#9C9289] hidden sm:inline">REST API POST</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-[#2F2723] bg-[#1C1816] text-[#9C9289] transition-colors hover:border-red-500 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="flex items-start gap-2.5 border border-red-800/80 bg-red-950/30 p-3 font-['JetBrains_Mono'] text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-3">
            <h4 className="font-['Syne'] text-sm font-bold uppercase tracking-wider text-[#E08E45]">
              1. SPACE IDENTIFIERS
            </h4>

            <div>
              <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                Cafe Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ruang Temu Coffee & Space"
                className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
              />
            </div>

            <div>
              <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                Full Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Jl. Slamet Riyadi No. 120, Surakarta"
                className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="08:00 - 23:00"
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="LOW">LOW (Quiet / High Focus)</option>
                  <option value="MODERATE">MODERATE (Balanced)</option>
                  <option value="HIGH">HIGH (Busy / Social)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Hardware Telemetry */}
          <div className="space-y-3 border-t border-[#2F2723] pt-4">
            <h4 className="font-['Syne'] text-sm font-bold uppercase tracking-wider text-[#E08E45]">
              2. HARDWARE &amp; AMENITIES TELEMETRY
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                />
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="EXCELLENT">EXCELLENT (&lt; 15ms latency)</option>
                  <option value="GOOD">GOOD (Stable browsing &amp; calls)</option>
                  <option value="FAIR">FAIR (Occasional jitter)</option>
                  <option value="POOR">POOR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="PLENTY">PLENTY (At almost every desk)</option>
                  <option value="MODERATE">MODERATE (Available at select desks)</option>
                  <option value="LIMITED">LIMITED (Few wall plugs)</option>
                  <option value="NONE">NONE</option>
                </select>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-1">
                  Acoustic Noise Level
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
                  className="w-full border border-[#2F2723] bg-[#0F0D0C] px-3 py-2 font-['JetBrains_Mono'] text-xs text-[#F7F3EE] outline-none transition-colors focus:border-[#E08E45]"
                >
                  <option value="QUIET">QUIET (Library / Deep Focus)</option>
                  <option value="MODERATE">MODERATE (Light Cafe Music)</option>
                  <option value="NOISY">NOISY (High Chatter / Loud Music)</option>
                </select>
              </div>
            </div>

            {/* Checkbox Amenities */}
            <div className="pt-2">
              <label className="block font-['JetBrains_Mono'] text-xs uppercase text-[#9C9289] mb-2">
                Included Facilities
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-['JetBrains_Mono'] text-xs">
                
                <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer hover:border-[#E08E45]">
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
                    className="accent-[#E08E45]"
                  />
                  <span>Air Conditioned</span>
                </label>

                <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer hover:border-[#E08E45]">
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
                    className="accent-[#E08E45]"
                  />
                  <span>Outdoor Area</span>
                </label>

                <label className="flex items-center gap-2 border border-[#2F2723] bg-[#0F0D0C] p-2.5 cursor-pointer hover:border-[#E08E45]">
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
                    className="accent-[#E08E45]"
                  />
                  <span>Prayer Room</span>
                </label>

              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="border-t border-[#2F2723] pt-5">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 border border-[#E08E45] bg-[#E08E45] py-3 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#0F0D0C] transition-all hover:bg-[#F59E0B] brutalist-shadow-black disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>TRANSMITTING TO BACKEND...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>PUBLISH WORKSPACE TO DIRECTORY</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

