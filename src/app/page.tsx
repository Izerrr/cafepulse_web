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
    <main className="min-h-screen bg-[#09090B] text-[#EDEDED] selection:bg-[#EDEDED] selection:text-[#09090B]">
      
      {/* Top Navbar */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Hero Section (Onlines.com.ar canvas style) */}
      <HeroSection
        onScrollToExplore={scrollToExplore}
        totalCafes={allCafes.length || 2}
      />

      {/* Running Marquee Ticker */}
      <MarqueeTicker />

      {/* Explore Cafes Section */}
      <div ref={exploreRef} className="scroll-mt-14">
        
        {/* Filter Bar */}
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-xl border border-white/[0.08] bg-[#121215] p-5 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 rounded bg-white/[0.05]" />
                    <div className="h-4 w-16 rounded bg-white/[0.05]" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-white/[0.05]" />
                  <div className="h-4 w-1/2 rounded bg-white/[0.05]" />
                  <div className="grid grid-cols-3 gap-2 py-2">
                    <div className="h-14 rounded bg-white/[0.03]" />
                    <div className="h-14 rounded bg-white/[0.03]" />
                    <div className="h-14 rounded bg-white/[0.03]" />
                  </div>
                  <div className="h-9 rounded bg-white/[0.05]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-xs">
              <AlertCircle className="mx-auto h-7 w-7 text-red-400 mb-2.5" />
              <h3 className="text-sm font-semibold text-[#EDEDED]">
                Gagal memuat data kafe
              </h3>
              <p className="mt-1 text-[#A1A1AA]">
                {(error as Error)?.message || 'Koneksi ke backend API terputus.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#EDEDED] px-3.5 py-1.5 font-medium text-[#09090B] hover:bg-white"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {/* Loaded Cafes Grid */}
          {!isLoading && !isError && (
            <>
              {filteredCafes.length === 0 ? (
                <div className="rounded-xl border border-white/[0.08] bg-[#121215] p-12 text-center">
                  <Coffee className="mx-auto h-9 w-9 text-[#52525B] mb-3" />
                  <h3 className="text-base font-semibold text-[#EDEDED]">
                    Tidak ada kafe yang cocok dengan filter
                  </h3>
                  <p className="mt-1.5 text-xs text-[#71717A] max-w-md mx-auto">
                    Coba turunkan batas kecepatan Wi-Fi atau reset filter pencarian untuk melihat semua kafe.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setFilters(initialFilters)}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium text-[#EDEDED] hover:border-white/20"
                    >
                      Reset Filter
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rounded-lg bg-[#EDEDED] px-3.5 py-1.5 text-xs font-medium text-[#09090B] hover:bg-white"
                    >
                      + Tambah Kafe Baru
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#EDEDED] text-[#09090B] shadow-lg transition-transform hover:scale-105 hover:bg-white active:scale-95"
        title="Tambah Kafe"
      >
        <Plus className="h-5 w-5 stroke-[2.5]" />
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
