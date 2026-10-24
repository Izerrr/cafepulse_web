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
import { Plus, Coffee, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

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

  // Fetch cafes using React Query
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

  // Client-side additional filtering for speed, plugs, noise, AC, outdoor, prayer room
  const filteredCafes = useMemo(() => {
    return allCafes.filter((cafe) => {
      const amenities = cafe.amenities;
      if (!amenities) return true;

      // Wi-Fi speed threshold
      if (filters.minWifiSpeed > 0 && amenities.wifi_speed_mbps < filters.minWifiSpeed) {
        return false;
      }

      // Plug score filter
      if (filters.plugScore !== 'ALL' && amenities.plug_score !== filters.plugScore) {
        return false;
      }

      // Noise level filter
      if (filters.noiseLevel !== 'ALL' && amenities.noise_level !== filters.noiseLevel) {
        return false;
      }

      // Amenities checkboxes
      if (filters.acOnly && !amenities.air_conditioned) return false;
      if (filters.outdoorOnly && !amenities.has_outdoor) return false;
      if (filters.prayerRoomOnly && !amenities.has_prayer_room) return false;

      return true;
    });
  }, [allCafes, filters]);

  return (
    <main className="min-h-screen bg-[#0F0D0C] text-[#F7F3EE] selection:bg-[#E08E45] selection:text-[#0F0D0C]">
      
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse border border-[#2F2723] bg-[#161311] p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-[#2F2723]" />
                    <div className="h-4 w-20 bg-[#2F2723]" />
                  </div>
                  <div className="h-8 w-3/4 bg-[#2F2723]" />
                  <div className="h-4 w-1/2 bg-[#2F2723]" />
                  <div className="grid grid-cols-3 gap-2 py-4">
                    <div className="h-16 bg-[#0F0D0C]" />
                    <div className="h-16 bg-[#0F0D0C]" />
                    <div className="h-16 bg-[#0F0D0C]" />
                  </div>
                  <div className="h-10 bg-[#2F2723]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="border border-red-900/60 bg-red-950/20 p-8 text-center font-['JetBrains_Mono']">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-3" />
              <h3 className="text-lg font-bold text-[#F7F3EE] uppercase">
                COMMUNICATION DISRUPTION
              </h3>
              <p className="mt-1 text-sm text-[#9C9289]">
                Unable to retrieve workspaces from CafePulse backend API.
              </p>
              <p className="mt-1 text-xs text-red-400">
                {(error as Error)?.message || 'Network error'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 border border-[#E08E45] bg-[#E08E45] px-4 py-2 text-xs font-bold uppercase text-[#0F0D0C] hover:bg-[#F59E0B]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>RETRY SYNC</span>
              </button>
            </div>
          )}

          {/* Loaded Cafes Grid */}
          {!isLoading && !isError && (
            <>
              {filteredCafes.length === 0 ? (
                <div className="border border-[#2F2723] bg-[#161311] p-12 text-center font-['JetBrains_Mono']">
                  <Coffee className="mx-auto h-10 w-10 text-[#574B43] mb-4" />
                  <h3 className="font-['Syne'] text-xl font-bold uppercase text-[#F7F3EE]">
                    NO SPACES MATCH THE CHOSEN CRITERIA
                  </h3>
                  <p className="mt-2 text-xs text-[#9C9289] max-w-md mx-auto">
                    Try relaxing the Wi-Fi speed threshold or resetting filter chips to view all audited workspaces.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setFilters(initialFilters)}
                      className="border border-[#2F2723] bg-[#1C1816] px-4 py-2 text-xs font-bold uppercase text-[#F7F3EE] hover:border-[#E08E45]"
                    >
                      RESET FILTERS
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="border border-[#E08E45] bg-[#E08E45] px-4 py-2 text-xs font-bold uppercase text-[#0F0D0C] hover:bg-[#F59E0B]"
                    >
                      + SUBMIT NEW CAFE
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

      {/* Floating Action Button for Quick Add */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center border-2 border-[#0F0D0C] bg-[#E08E45] text-[#0F0D0C] shadow-2xl brutalist-shadow-black transition-all hover:scale-105 hover:bg-[#F59E0B] active:translate-x-0.5 active:translate-y-0.5"
        title="Add New Workspace"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
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
