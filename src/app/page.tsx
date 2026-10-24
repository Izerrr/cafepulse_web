'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cafe } from '@/types/cafe';
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import MarqueeTicker from '@/components/hero/MarqueeTicker';
import FilterBar, { FilterState } from '@/components/filters/FilterBar';
import CafeCard from '@/components/cafes/CafeCard';
import CafeDetailModal from '@/components/cafes/CafeDetailModal';
import AddCafeModal from '@/components/cafes/AddCafeModal';
import EditCafeModal from '@/components/cafes/EditCafeModal';
import Footer from '@/components/footer/Footer';
import { Plus, Coffee, RefreshCw, AlertCircle } from 'lucide-react';

const initialFilters: FilterState = {
  search: '',
  crowdDensity: 'ALL',
  minWifiSpeed: 0,
  plugScore: 'ALL',
  noiseLevel: 'ALL',
  acOnly: false,
  outdoorOnly: false,
  prayerRoomOnly: false,
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    data: cafeResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cafes', filters.search, filters.crowdDensity],
    queryFn: () =>
      api.getCafes({
        q: filters.search,
        crowd_density: filters.crowdDensity,
      }),
  });

  const allCafes = cafeResponse?.data || [];

  const filteredCafes = useMemo(() => {
    return allCafes.filter((cafe) => {
      const amenities = cafe.amenities;
      if (!amenities) return true;

      if (filters.minWifiSpeed > 0 && amenities.wifi_speed_mbps < filters.minWifiSpeed) {
        return false;
      }

      if (filters.plugScore !== 'ALL' && amenities.plug_score !== filters.plugScore) {
        return false;
      }

      if (filters.noiseLevel !== 'ALL' && amenities.noise_level !== filters.noiseLevel) {
        return false;
      }

      if (filters.acOnly && !amenities.air_conditioned) return false;
      if (filters.outdoorOnly && !amenities.has_outdoor) return false;
      if (filters.prayerRoomOnly && !amenities.has_prayer_room) return false;

      return true;
    });
  }, [allCafes, filters]);

  return (
    <main className="min-h-screen bg-[#0B0908] text-[#F9F6F0] selection:bg-[#E59850] selection:text-[#0B0908]">
      
      {/* Top Navbar */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Hero Section */}
      <HeroSection
        onScrollToExplore={scrollToExplore}
        totalCafes={allCafes.length || 2}
      />

      {/* Running Marquee Ticker */}
      <MarqueeTicker />

      {/* Explore Workspaces Section */}
      <div ref={exploreRef} className="scroll-mt-14">
        
        {/* Interactive Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
          totalResults={filteredCafes.length}
        />

        {/* Cafe Grid Container */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-white/[0.06] bg-[#14110F] p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-28 rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-16 rounded-full bg-white/[0.05]" />
                  </div>
                  <div className="h-6 w-3/4 rounded-lg bg-white/[0.05]" />
                  <div className="h-4 w-1/2 rounded-lg bg-white/[0.05]" />
                  <div className="grid grid-cols-3 gap-2.5 py-3">
                    <div className="h-16 rounded-xl bg-white/[0.03]" />
                    <div className="h-16 rounded-xl bg-white/[0.03]" />
                    <div className="h-16 rounded-xl bg-white/[0.03]" />
                  </div>
                  <div className="h-10 rounded-xl bg-white/[0.05]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-3" />
              <h3 className="text-base font-semibold text-[#F9F6F0]">
                Unable to load workspaces
              </h3>
              <p className="mt-1 text-xs text-[#A3988E]">
                {(error as Error)?.message || 'Communication error with CafePulse API.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E59850] px-4 py-2 text-xs font-semibold text-[#0B0908] hover:bg-[#F0A560]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Loaded Cafes Grid */}
          {!isLoading && !isError && (
            <>
              {filteredCafes.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-12 text-center">
                  <Coffee className="mx-auto h-10 w-10 text-[#6B6158] mb-3" />
                  <h3 className="text-lg font-semibold text-[#F9F6F0]">
                    No spaces match the selected filters
                  </h3>
                  <p className="mt-1.5 text-xs text-[#A3988E] max-w-md mx-auto">
                    Try adjusting the Wi-Fi speed threshold or clearing filters to see all available spaces.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setFilters(initialFilters)}
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-semibold text-[#F9F6F0] hover:border-amber-500/40"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rounded-full bg-[#E59850] px-4 py-2 text-xs font-semibold text-[#0B0908] hover:bg-[#F0A560]"
                    >
                      + Add New Cafe
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredCafes.map((cafe) => (
                    <CafeCard
                      key={cafe.id}
                      cafe={cafe}
                      onExplore={(c) => setSelectedCafe(c)}
                      onEdit={(c) => setEditingCafe(c)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#E59850] text-[#0B0908] shadow-2xl transition-all hover:scale-105 hover:bg-[#F0A560] hover:shadow-[0_0_30px_-5px_rgba(229,152,80,0.5)] active:scale-95"
        title="Submit Workspace"
      >
        <Plus className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Modals */}
      <CafeDetailModal
        cafe={selectedCafe}
        onClose={() => setSelectedCafe(null)}
        onEdit={(cafe) => {
          setSelectedCafe(null);
          setEditingCafe(cafe);
        }}
      />

      <AddCafeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCafeModal
        cafe={editingCafe}
        onClose={() => setEditingCafe(null)}
      />

      {/* Footer */}
      <Footer />

    </main>
  );
}
