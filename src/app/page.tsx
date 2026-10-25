'use client';

import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
import { AddReviewModal } from '@/components/cafes/AddReviewModal';
import { UserAccessModal } from '@/components/auth/UserAccessModal';
import DeveloperApiSection from '@/components/developer/DeveloperApiSection';
import Footer from '@/components/footer/Footer';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useUserRole } from '@/hooks/useUserRole';
import {
  Plus,
  Coffee,
  RefreshCw,
  AlertCircle,
  LayoutGrid,
  Map as MapIcon,
  ShieldCheck,
} from 'lucide-react';

const CafeInteractiveMap = dynamic(
  () => import('@/components/map/CafeInteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-130 w-full rounded-3xl border border-canvas-border bg-canvas-surface flex flex-col items-center justify-center gap-3 text-roast-600 animate-pulse">
        <MapIcon className="w-8 h-8 text-crema-500 animate-bounce" />
        <span className="font-mono text-xs uppercase tracking-widest">
          Memuat Peta Google Maps Surakarta...
        </span>
      </div>
    ),
  }
);

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
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);
  const [reviewingCafe, setReviewingCafe] = useState<Cafe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const { isBookmarked, toggleBookmark, totalBookmarks, bookmarkedIds } = useBookmarks();
  const { role, isCurator, loginAsCurator, logoutToVisitor } = useUserRole();

  const exploreRef = useRef<HTMLDivElement>(null);

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenMapView = () => {
    setViewMode('map');
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestEdit = (cafe: Cafe) => {
    if (!isCurator) {
      setIsAccessModalOpen(true);
      return;
    }
    setEditingCafe(cafe);
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
    <main className="min-h-screen bg-canvas-bg text-roast-900">
      {/* Top Studio Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalBookmarks={totalBookmarks}
        isBookmarkActive={currentMood === 'BOOKMARKS'}
        onFilterBookmarks={() =>
          handleSelectMood(currentMood === 'BOOKMARKS' ? 'ALL' : 'BOOKMARKS')
        }
        userRole={role}
        onOpenAccessModal={() => setIsAccessModalOpen(true)}
        onOpenMapView={handleOpenMapView}
      />

      {/* Onlines.com.ar Interactive Draggable Studio Hero with Surakarta Map Radar */}
      <OnlinesHero
        onScrollToExplore={scrollToExplore}
        onOpenMapView={handleOpenMapView}
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

        {/* View Mode Switcher Bar (Cards vs Interactive Solo Map) */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-canvas-border">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-crema-600 block">
                Direktori &amp; Peta Komunitas Surakarta
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-roast-900 mt-0.5">
                {viewMode === 'grid'
                  ? `Menampilkan ${filteredCafes.length} Kafe Pilihan di Solo`
                  : 'Peta Surakarta & Sinkronisasi Kafe Google Maps'}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="inline-flex rounded-full border border-canvas-border bg-canvas-surface p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-roast-900 text-canvas-bg shadow-xs'
                      : 'text-roast-600 hover:text-roast-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Kartu Kafe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-crema-500 text-canvas-surface shadow-xs'
                      : 'text-roast-600 hover:text-roast-900'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Peta Google Maps &amp; Sync</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAccessModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 rounded-full border border-canvas-border bg-canvas-surface px-3 py-2 text-[11px] font-mono text-roast-600 hover:border-crema-500 hover:text-roast-900 transition-colors"
                title="Klik untuk beralih antara Mode Pengunjung & Mode Kurator"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-crema-500" />
                <span>{isCurator ? 'Kurator Aktif' : 'Info Akses'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cafe Grid or Interactive Map Container */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-2xl border border-canvas-border bg-white p-6 space-y-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-canvas-border">
                    <div className="h-5 w-24 rounded-full bg-roast-100" />
                    <div className="h-4 w-16 rounded bg-roast-100" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-roast-100" />
                  <div className="h-4 w-1/2 rounded bg-roast-100" />
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-canvas-border">
                    <div className="h-16 rounded-xl bg-canvas-surface" />
                    <div className="h-16 rounded-xl bg-canvas-surface" />
                    <div className="h-16 rounded-xl bg-canvas-surface" />
                  </div>
                  <div className="h-10 rounded-full bg-roast-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center text-xs">
              <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2.5" />
              <h3 className="text-sm font-semibold text-rose-900">
                Gagal memuat data kafe
              </h3>
              <p className="mt-1 text-rose-700">
                {(error as Error)?.message || 'Koneksi ke backend API terputus.'}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {/* Loaded View: Either Interactive Map OR Card Grid */}
          {!isLoading && !isError && (
            <>
              {viewMode === 'map' ? (
                <CafeInteractiveMap
                  cafes={filteredCafes}
                  allCafes={allCafes}
                  onSelectCafe={(cafe) => setSelectedCafe(cafe)}
                  onReviewCafe={(cafe) => setReviewingCafe(cafe)}
                />
              ) : filteredCafes.length === 0 ? (
                <div className="rounded-2xl border border-canvas-border bg-white p-12 text-center shadow-xs">
                  <Coffee className="mx-auto h-10 w-10 text-roast-300 mb-3" />
                  <h3 className="text-base font-bold text-roast-900">
                    {currentMood === 'BOOKMARKS'
                      ? 'Belum ada kafe yang disimpan ke favorit'
                      : 'Tidak ada kafe yang cocok dengan filter'}
                  </h3>
                  <p className="mt-1.5 text-xs text-roast-600 max-w-md mx-auto leading-relaxed">
                    {currentMood === 'BOOKMARKS'
                      ? 'Tekan ikon bookmark pada kartu kafe mana saja untuk menyimpannya ke daftar ini.'
                      : 'Coba turunkan batas kecepatan Wi-Fi, buka Peta Interaktif untuk menarik kafe baru dari Maps, atau reset filter.'}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setFilters(initialFilters);
                        setCurrentMood('ALL');
                      }}
                      className="rounded-full border border-canvas-border bg-white px-4 py-2 text-xs font-semibold text-roast-900 hover:border-canvas-border-hover transition-colors shadow-xs"
                    >
                      Tampilkan Semua Kafe
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className="rounded-full bg-crema-500 px-4 py-2 text-xs font-semibold text-white hover:bg-crema-600 transition-colors shadow-xs"
                    >
                      🗺️ Cari &amp; Impor dari Peta Solo
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rounded-full bg-roast-900 px-4 py-2 text-xs font-semibold text-white hover:bg-crema-500 transition-colors shadow-xs"
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
                      onEdit={handleRequestEdit}
                      onReview={(c) => setReviewingCafe(c)}
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

      {/* Floating Action Button (Studio Pill in Deep Espresso) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-roast-900 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-transform hover:scale-105 hover:bg-crema-500 active:scale-95"
        title="Tambah & Sinkronkan Kafe Baru"
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
          handleRequestEdit(cafe);
        }}
        onReview={(cafe) => {
          setSelectedCafe(null);
          setReviewingCafe(cafe);
        }}
        isCurator={isCurator}
      />

      <AddCafeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCafeModal
        cafe={editingCafe}
        onClose={() => setEditingCafe(null)}
      />

      <AddReviewModal
        cafe={reviewingCafe}
        onClose={() => setReviewingCafe(null)}
      />

      <UserAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        role={role}
        onLoginCurator={loginAsCurator}
        onLogoutVisitor={logoutToVisitor}
      />

      {/* Dedicated Section: Open Data & Public API for Developers / Students */}
      <DeveloperApiSection />

      {/* Studio Footer */}
      <Footer />
    </main>
  );
}
