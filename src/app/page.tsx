'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cafe, FilterState } from '@/types/cafe';
import Navbar from '@/components/navbar/Navbar';
import OnlinesHero from '@/components/hero/OnlinesHero';
import MarqueeTicker from '@/components/hero/MarqueeTicker';
import MoodSwitcher, { MoodMode } from '@/components/filters/MoodSwitcher';
import FilterBar from '@/components/filters/FilterBar';
import CafeCard from '@/components/cafes/CafeCard';
import CafeDetailModal from '@/components/cafes/CafeDetailModal';
import AddCafeModal from '@/components/cafes/AddCafeModal';
import EditCafeModal from '@/components/cafes/EditCafeModal';
import DeveloperApiSection from '@/components/developer/DeveloperApiSection';
import Footer from '@/components/footer/Footer';
import { useBookmarks } from '@/hooks/useBookmarks';
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
  const [currentMood, setCurrentMood] = useState<MoodMode>('ALL');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { isBookmarked, toggleBookmark, totalBookmarks, bookmarkedIds } = useBookmarks();

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

  const allCafes = useMemo(() => cafeResponse?.data || [], [cafeResponse?.data]);

  // Handle Mood Selection
  const handleSelectMood = (mood: MoodMode) => {
    setCurrentMood(mood);
    if (mood === 'ALL') {
      setFilters(initialFilters);
    } else if (mood === 'DEEP_WORK') {
      setFilters({
        ...initialFilters,
        minWifiSpeed: 50,
        plugScore: 'PLENTY',
        noiseLevel: 'QUIET',
      });
    } else if (mood === 'MEETING') {
      setFilters({
        ...initialFilters,
        acOnly: true,
      });
    }
  };

  // Toggle Focus Mode from Hero
  const handleToggleFocusMode = (isFocus: boolean) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      crowdDensity: isFocus ? 'LOW' : 'ALL',
    }));
  };

  // Filter cafes including Bookmark mode
  const filteredCafes = useMemo(() => {
    return allCafes.filter((cafe) => {
      // If bookmarks mode active
      if (currentMood === 'BOOKMARKS' && !bookmarkedIds.includes(cafe.id)) {
        return false;
      }

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
  }, [allCafes, filters, currentMood, bookmarkedIds]);

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      
      {/* Top Studio Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalBookmarks={totalBookmarks}
        isBookmarkActive={currentMood === 'BOOKMARKS'}
        onFilterBookmarks={() =>
          handleSelectMood(currentMood === 'BOOKMARKS' ? 'ALL' : 'BOOKMARKS')
        }
      />

      {/* Onlines.com.ar Interactive Draggable Studio Hero */}
      <OnlinesHero
        onScrollToExplore={scrollToExplore}
        totalCafes={allCafes.length || 2}
        onToggleFocusMode={handleToggleFocusMode}
      />

      {/* Running Marquee Ticker */}
      <MarqueeTicker />

      {/* Explore Section */}
      <div ref={exploreRef} className="scroll-mt-14">
        
        {/* Quick Mood Switcher */}
        <MoodSwitcher
          currentMood={currentMood}
          onSelectMood={handleSelectMood}
          totalBookmarks={totalBookmarks}
        />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => {
            setFilters(initialFilters);
            setCurrentMood('ALL');
          }}
          totalResults={filteredCafes.length}
        />

        {/* Cafe Grid Container */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-[#111111]/8 bg-[#F9F9FB] p-6 space-y-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-[#111111]/8">
                    <div className="h-5 w-24 rounded-full bg-[#111111]/10" />
                    <div className="h-4 w-16 rounded bg-[#111111]/10" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-[#111111]/10" />
                  <div className="h-4 w-1/2 rounded bg-[#111111]/8" />
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#111111]/8">
                    <div className="h-16 rounded-xl bg-[#111111]/5" />
                    <div className="h-16 rounded-xl bg-[#111111]/5" />
                    <div className="h-16 rounded-xl bg-[#111111]/5" />
                  </div>
                  <div className="h-10 rounded-full bg-[#111111]/10" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center text-xs">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2.5" />
              <h3 className="text-sm font-semibold text-red-900">
                Gagal memuat data kafe
              </h3>
              <p className="mt-1 text-red-700">
                {(error as Error)?.message || 'Koneksi ke backend API terputus.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
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
                <div className="rounded-2xl border border-[#111111]/8 bg-[#F9F9FB] p-12 text-center">
                  <Coffee className="mx-auto h-10 w-10 text-[#888888] mb-3" />
                  <h3 className="text-base font-bold text-[#111111]">
                    {currentMood === 'BOOKMARKS'
                      ? 'Belum ada kafe yang disimpan ke favorit'
                      : 'Tidak ada kafe yang cocok dengan filter'}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
                    {currentMood === 'BOOKMARKS'
                      ? 'Tekan ikon bookmark pada kartu kafe mana saja untuk menyimpannya ke daftar ini.'
                      : 'Coba turunkan batas kecepatan Wi-Fi atau reset filter untuk melihat semua kafe.'}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setFilters(initialFilters);
                        setCurrentMood('ALL');
                      }}
                      className="rounded-full border border-[#111111]/15 bg-white px-4 py-2 text-xs font-semibold text-[#111111] hover:border-[#111111]/30 transition-colors shadow-sm"
                    >
                      Tampilkan Semua Kafe
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0070F3] transition-colors shadow-sm"
                    >
                      + Tambah Kafe Baru
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCafes.map((cafe) => (
                    <CafeCard
                      key={cafe.id}
                      cafe={cafe}
                      onExplore={(c) => setSelectedCafe(c)}
                      onEdit={(c) => setEditingCafe(c)}
                      isBookmarked={isBookmarked(cafe.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Floating Action Button (Studio Pill) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#111111] px-4 py-3 text-xs font-semibold text-white shadow-xl transition-transform hover:scale-105 hover:bg-[#0070F3] active:scale-95"
        title="Tambah Kafe Baru"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span className="hidden sm:inline">Tambah Kafe</span>
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

      {/* Dedicated Section: Open Data & Public API for Developers / Students (Onlines Dark Mode Block) */}
      <DeveloperApiSection />

      {/* Studio Footer */}
      <Footer />

    </main>
  );
}
